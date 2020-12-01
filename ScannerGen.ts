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

class RegEx {
  private fa: FA;
  constructor(regexp: string) {
    let nfa = makeNFA(regexp);
    this.fa = faOfNFA(nfa);
    console.log(Object.keys(this.fa).length);
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

let regexp = "[a-zA-Z0-9]+@[a-zA-Z0-9]+.[a-zA-Z]{2+}";

//let regexp = "(0|1)*1";
// let regexp = new RegEx(
//   "(a|(b|c))(a|(b|c))*@(a|(b|c))(a|(b|c))*.(a|(b|c))(a|(b|c))(a|(b|c))*"
// );
let str = "abc@a.ab";
console.log(regexp.matches(str));
