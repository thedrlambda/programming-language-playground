"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs"));
var filename = process.argv[2];
var instrs = fs
    .readFileSync(filename)
    .toString()
    .replace(/SBNZ/g, "")
    .trim()
    .split(/\s+/);
var vars = {};
instrs.forEach(function (x, i) {
    if (x.startsWith("#")) {
        instrs[i] = "" + instrs.indexOf(x.substring(1));
    }
    else if (x.startsWith("[")) {
        if (vars[x] === undefined) {
            vars[x] = instrs.length;
            instrs.push(x.substring(1, x.length - 1));
        }
        instrs[i] = "" + vars[x];
    }
    else {
        instrs[i] = Number.isNaN(+x) ? "9999" : x;
    }
});
var prog = instrs.map(function (x) { return +x; });
var pc = 0;
while (pc >= 0) {
    var a = prog[pc + 0];
    var b = prog[pc + 1];
    var c = prog[pc + 2];
    var d = prog[pc + 3];
    while (c >= prog.length)
        prog.push(0);
    prog[c] = prog[b] - prog[a];
    if (prog[c] !== 0)
        pc = d;
    else
        pc += 4;
}
fs.writeFileSync(filename + ".out", prog.join(" "));
