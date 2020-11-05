import * as fs from "fs";

let filename = process.argv[2];
let instrs = fs
  .readFileSync(filename)
  .toString()
  .replace(/SBNZ/g, "")
  .trim()
  .split(/\s+/);
let vars: { [key: string]: number } = {};
instrs.forEach((x, i) => {
  if (x.startsWith("#")) {
    instrs[i] = "" + instrs.indexOf(x.substring(1));
  } else if (x.startsWith("[")) {
    if (vars[x] === undefined) {
      vars[x] = instrs.length;
      instrs.push(x.substring(1, x.length - 1));
    }
    instrs[i] = "" + vars[x];
  } else {
    instrs[i] = Number.isNaN(+x) ? "9999" : x;
  }
});
let prog = instrs.map((x) => +x);

let pc = 0;
while (pc >= 0) {
  let a = prog[pc + 0];
  let b = prog[pc + 1];
  let c = prog[pc + 2];
  let d = prog[pc + 3];
  while (c >= prog.length) prog.push(0);
  prog[c] = prog[b] - prog[a];
  if (prog[c] !== 0) pc = d;
  else pc += 4;
}

fs.writeFileSync(filename + ".out", prog.join(" "));
