type NFA = { [key: string]: number[] }[];
type FA = {
  [key: number]: {
    transitions: { [char: string]: number };
    accept: boolean;
  };
};

function makeNFA(regEx: string): NFA {
  let stack: number[] = [];
  let map: { [key: string]: number[] }[] = [];
  for (let i = 0; i < regEx.length + 1; i++) {
    map.push({});
  }
  for (let i = 0; i < regEx.length; i++) {
    let c = regEx.charAt(i);
    if (c === "(" || c === "|") stack.push(i);
    let start: number;
    if (c === ")") {
      let pipe = stack.pop()!;
      if (regEx.charAt(pipe) === "|") {
        start = stack.pop()!;
        if (map[pipe][""] === undefined) map[pipe][""] = [];
        map[pipe][""].push(i);
        if (map[start][""] === undefined) map[start][""] = [];
        map[start][""].push(pipe + 1);
      } else start = pipe;
    } else {
      start = i;
    }
    if (regEx.charAt(i + 1) === "*") {
      if (map[i + 1][""] === undefined) map[i + 1][""] = [];
      map[i + 1][""].push(start);
      if (map[start][""] === undefined) map[start][""] = [];
      map[start][""].push(i + 1);
    }

    if (c === "(" || c === ")" || c === "*") {
      if (map[i][""] === undefined) map[i][""] = [];
      map[i][""].push(i + 1);
    } else if (c === "|") {
    } else {
      if (map[i][c] === undefined) map[i][c] = [];
      map[i][c].push(i + 1);
    }
  }
  return map;
}

function addAllUnique<T>(as: T[], bs: T[]) {
  (bs || []).forEach((b) => {
    if (as.indexOf(b) < 0) as.push(b);
  });
}

function arrayToString(arr: number[]) {
  arr.sort();
  return arr.join(",");
}

function addClojure(arr: number[], nfa: NFA) {
  for (let i = 0; i < arr.length; i++) {
    addAllUnique(arr, nfa[arr[i]][""]);
  }
}

function faOfNFA(nfa: NFA): FA {
  let map: FA = {};
  let initial = [0];
  addClojure(initial, nfa);

  let stateNames: string[] = [];
  let toVisit: number[][] = [initial];
  while (toVisit.length > 0) {
    let current = toVisit.splice(0, 1)[0];
    let alpha: string[] = [];
    current.forEach((x) => {
      Object.keys(nfa[x]).forEach((a) => {
        if (a !== "" && alpha.indexOf(a) < 0) alpha.push(a);
      });
    });
    let name = arrayToString(current);
    if (stateNames.indexOf(name) < 0) stateNames.push(name);
    let cString = stateNames.indexOf(name);
    map[cString] = {
      transitions: {},
      accept: current.indexOf(nfa.length - 1) >= 0,
    };
    alpha.forEach((a) => {
      let collect: number[] = [];
      current.forEach((s) => {
        addAllUnique(collect, nfa[s][a]);
      });
      addClojure(collect, nfa);
      let name = arrayToString(collect);
      if (stateNames.indexOf(name) < 0) stateNames.push(name);
      let collectString = stateNames.indexOf(name);
      map[cString].transitions[a] = collectString;
      if (map[collectString] === undefined) toVisit.push(collect);
    });
  }
  return map;
}

function xor(a: boolean, b: boolean) {
  return a !== b;
}

function minimize(fa: FA) {
  let classes: (number | null)[][] = [];
  let len = Object.keys(fa).length;
  for (let i = 0; i < len; i++) {
    classes.push([]);
  }
  for (let i = 0; i < len; i++) {
    for (let j = i + 1; j < len; j++) {
      if (xor(fa[i].accept, fa[j].accept)) {
        classes[j][i] = 1;
      }
    }
  }
  let changed = true;
  let pass = 2;
  while (changed) {
    changed = false;
    for (let i = 0; i < len; i++) {
      for (let j = i + 1; j < len; j++) {
        if (classes[j][i] !== undefined) continue;
        let transitionsI = Object.keys(fa[i].transitions);
        let transitionsJ = Object.keys(fa[j].transitions);
        transitionsI
          .filter((x) => transitionsJ.includes(x))
          .forEach((x) => {
            let [min, max] = myMin(fa[i].transitions[x], fa[j].transitions[x]);
            let marked = classes[max][min];
            if (marked !== undefined) {
              classes[j][i] = pass;
              changed = true;
            }
          });
      }
    }
    pass++;
  }
  // printTable(classes);
  let map: { [key: number]: number } = {};
  for (let i = 0; i < len; i++) {
    for (let j = i - 1; j >= 0; j--) {
      if (classes[i][j] === undefined) map[i] = j;
    }
  }
  for (let i = 0; i < len; i++) {
    Object.keys(fa[i].transitions).forEach((k) => {
      let endState = fa[i].transitions[k];
      if (map[endState] !== undefined) {
        fa[i].transitions[k] = map[endState];
      }
    });
  }
  Object.keys(map).forEach((x) => {
    delete fa[+x];
  });
}

function myMin(a: number, b: number) {
  if (a <= b) return [a, b];
  else return [b, a];
}

function isPrefix<T>(ar1: T[], ar2: T[]) {
  for (let k = 0; k < Math.min(ar1.length, ar2.length); k++) {
    if (ar1[k] !== ar2[k]) return false;
  }
  return true;
}

function printTable<T>(table: T[][]) {
  for (let x = 0; x < table.length; x++) {
    let result = "";
    for (let y = 0; y < table[x].length; y++) {
      if (y > 0) result += " | ";
      result += table[x][y] || " ";
    }
    console.log(result);
  }
}

function arrayEquals<T>(ar1: T[], ar2: T[]) {
  if (ar1.length !== ar2.length) return false;
  for (let k = 0; k < ar1.length; k++) {
    if (ar1[k] !== ar2[k]) return false;
  }
  return true;
}

class RegEx {
  private fa: FA;
  constructor(regexp: string) {
    let nfa = makeNFA(regexp);
    this.fa = faOfNFA(nfa);
    // console.log(this.fa);
    // console.log(Object.keys(this.fa).length);
    minimize(this.fa);
    // console.log(this.fa);
    // console.log(Object.keys(this.fa).length);
  }
  matches(str: string) {
    let state = 0;
    for (let i = 0; i < str.length; i++) {
      let c = str.charAt(i);
      state = this.fa[state].transitions[c];
      if (state === undefined) return false;
    }
    return this.fa[state].accept;
  }
}

// let regexp = "[a-zA-Z0-9]+@[a-zA-Z0-9]+.[a-zA-Z]{2+}";

let regexp = new RegEx("(0|(1|(a|b)))*01");
// let regexp = new RegEx(
//   "(a|(b|c))(a|(b|c))*@(a|(b|c))(a|(b|c))*.(a|(b|c))(a|(b|c))(a|(b|c))*"
// );
console.log(regexp.matches("001001010110101"), true);
console.log(regexp.matches("00100101011010"), false);
console.log(regexp.matches("00"), false);
console.log(regexp.matches("01"), true);

// Today:
// * Minimize
// * Store in files
// * Generate token
// * Syntactic sugar
