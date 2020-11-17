import { S_IFDIR } from "constants";
import fs from "fs";
import { Lexer } from "./lexer";

interface Instruction {
  lineNumber: number;
  apply<T>(a: Visitor<T>): T;
}
class Label implements Instruction {
  constructor(
    public readonly lineNumber: number,
    public readonly label: string
  ) {}
  apply<T>(a: Visitor<T>) {
    return a.caseLabel(this);
  }
}

class Func implements Instruction {
  constructor(
    public readonly lineNumber: number,
    public readonly name: string,
    public readonly params: number,
    public readonly locals: number
  ) {}
  apply<T>(a: Visitor<T>) {
    return a.caseFunc(this);
  }
}
class IReturn implements Instruction {
  constructor(public readonly lineNumber: number) {}
  apply<T>(a: Visitor<T>) {
    return a.caseReturn(this);
  }
}
class ICall implements Instruction {
  constructor(
    public readonly lineNumber: number,
    public readonly name: string
  ) {}
  apply<T>(a: Visitor<T>) {
    return a.caseCall(this);
  }
}

class IStore implements Instruction {
  constructor(
    public readonly lineNumber: number,
    public readonly index: number
  ) {}
  apply<T>(a: Visitor<T>) {
    return a.caseStore(this);
  }
}
class ILoad implements Instruction {
  constructor(
    public readonly lineNumber: number,
    public readonly index: number
  ) {}
  apply<T>(a: Visitor<T>) {
    return a.caseLoad(this);
  }
}

class IPush implements Instruction {
  constructor(
    public readonly lineNumber: number,
    public readonly arg: number
  ) {}
  apply<T>(a: Visitor<T>) {
    return a.casePush(this);
  }
}
class IPop implements Instruction {
  constructor(public readonly lineNumber: number) {}
  apply<T>(a: Visitor<T>) {
    return a.casePop(this);
  }
}
class IDup implements Instruction {
  constructor(public readonly lineNumber: number) {}
  apply<T>(a: Visitor<T>) {
    return a.caseDup(this);
  }
}
class ISwap implements Instruction {
  constructor(public readonly lineNumber: number) {}
  apply<T>(a: Visitor<T>) {
    return a.caseSwap(this);
  }
}
class ISub implements Instruction {
  constructor(public readonly lineNumber: number) {}
  apply<T>(a: Visitor<T>) {
    return a.caseSub(this);
  }
}

class IJmp implements Instruction {
  constructor(
    public readonly lineNumber: number,
    public readonly label: string
  ) {}
  apply<T>(a: Visitor<T>) {
    return a.caseJmp(this);
  }
}
class IZero implements Instruction {
  constructor(
    public readonly lineNumber: number,
    public readonly lTrue: string,
    public readonly lFalse: string
  ) {}
  apply<T>(a: Visitor<T>) {
    return a.caseZero(this);
  }
}

interface Visitor<T> {
  caseLabel(i: Label): T;
  caseFunc(i: Func): T;
  caseReturn(i: IReturn): T;
  caseCall(i: ICall): T;
  caseStore(i: IStore): T;
  caseLoad(i: ILoad): T;
  casePush(i: IPush): T;
  casePop(i: IPop): T;
  caseDup(i: IDup): T;
  caseSwap(i: ISwap): T;
  caseSub(i: ISub): T;
  caseJmp(i: IJmp): T;
  caseZero(i: IZero): T;
}

abstract class Analysis<T> implements Visitor<void> {
  default() {}
  before() {}
  abstract after(): T;
  caseLabel(i: Label) {
    this.default();
  }
  caseFunc(i: Func) {
    this.default();
  }
  caseReturn(i: IReturn) {
    this.default();
  }
  caseCall(i: ICall) {
    this.default();
  }
  caseStore(i: IStore) {
    this.default();
  }
  caseLoad(i: ILoad) {
    this.default();
  }
  casePush(i: IPush) {
    this.default();
  }
  casePop(i: IPop) {
    this.default();
  }
  caseDup(i: IDup) {
    this.default();
  }
  caseSwap(i: ISwap) {
    this.default();
  }
  caseSub(i: ISub) {
    this.default();
  }
  caseJmp(i: IJmp) {
    this.default();
  }
  caseZero(i: IZero) {
    this.default();
  }
}

class Parser {
  private instructions: Instruction[] = [];
  constructor(private lexer: Lexer) {}
  parse() {
    while (this.lexer.hasNext()) {
      let line = this.lexer.getLineNumber();
      if (this.lexer.consumeIf(":")) {
        let label = this.lexer.consumeId();
        this.instructions.push(new Label(line, label));
      } else if (this.lexer.consumeIf(".")) {
        let name = this.lexer.consumeId();
        let params = this.lexer.consumeNumber();
        let locals = this.lexer.consumeNumber();
        this.instructions.push(new Func(line, name, params, locals));
      } else if (this.lexer.consumeIf("return")) {
        this.instructions.push(new IReturn(line));
      } else if (this.lexer.consumeIf("call")) {
        let name = this.lexer.consumeId();
        this.instructions.push(new ICall(line, name));
      } else if (this.lexer.consumeIf("store")) {
        let v = this.lexer.consumeNumber();
        this.instructions.push(new IStore(line, v));
      } else if (this.lexer.consumeIf("load")) {
        let v = this.lexer.consumeNumber();
        this.instructions.push(new ILoad(line, v));
      } else if (this.lexer.consumeIf("push")) {
        let arg = this.lexer.consumeNumber();
        this.instructions.push(new IPush(line, arg));
      } else if (this.lexer.consumeIf("pop")) {
        this.instructions.push(new IPop(line));
      } else if (this.lexer.consumeIf("swap")) {
        this.instructions.push(new ISwap(line));
      } else if (this.lexer.consumeIf("dup")) {
        this.instructions.push(new IDup(line));
      } else if (this.lexer.consumeIf("sub")) {
        this.instructions.push(new ISub(line));
      } else if (this.lexer.consumeIf("jmp")) {
        let label = this.lexer.consumeId();
        this.instructions.push(new IJmp(line, label));
      } else if (this.lexer.consumeIf("zero")) {
        let label1 = this.lexer.consumeId();
        let label2 = this.lexer.consumeId();
        this.instructions.push(new IZero(line, label1, label2));
      } else {
        throw `Panic! '${this.lexer.look()}'`;
      }
    }
  }
  apply<T>(a: Analysis<T>) {
    a.before();
    this.instructions.forEach((i) => i.apply(a));
    return a.after();
  }
  getInstructions() {
    return this.instructions;
  }
}

class CodeGeneration extends Analysis<void> {
  private heap: number[] = [];
  private constants: number[] = [];
  private constantPoolStart = 0;
  private sp = 0;
  private lv = 0;
  private labels: { [label: string]: number } = {};
  private funcs: {
    [label: string]: { locals: number; params: number; loc: number };
  } = {};
  before() {
    this.heap = [];
  }
  after() {
    this.heap.push(this.refNum(0));
    this.heap.push(this.refNum(1));
    this.heap.push(this.refNum(1));
    this.heap.push(-1);

    this.constantPoolStart = this.heap.length;
    this.constants.forEach((x) => this.heap.push(x));
    this.lv = this.heap.length;
    this.heap.push(this.lv + 1);
    this.sp = this.heap.length;
    this.heap.push(this.sp + 1);
    fs.writeFileSync("out.sbnz", this.heap.map((x) => "" + x).join(" "));
  }
  caseFunc(i: Func) {
    this.funcs[i.name] = {
      locals: i.locals,
      params: i.params,
      loc: this.heap.length,
    };
  }
  caseLoad(i: ILoad) {
    // SBNZ [-var] [lv] #src X
    this.heap.push(this.refNum(-i.index));
    this.heap.push(this.lv);
    this.heap.push(this.heap.length + 7);
    this.heap.push(this.heap.length + 1);
    // SBNZ [0] [sp] #dst X
    this.heap.push(this.refNum(0));
    this.heap.push(this.sp);
    this.heap.push(this.heap.length + 4);
    this.heap.push(this.heap.length + 1);
    // SBNZ [0] src dst X
    this.heap.push(this.refNum(0));
    this.heap.push(9999);
    this.heap.push(9999);
    this.heap.push(this.heap.length + 1);
    // SBNZ [-1] [sp] [sp] X
    this.heap.push(this.refNum(-1));
    this.heap.push(this.sp);
    this.heap.push(this.sp);
    this.heap.push(this.heap.length + 1);
  }
  caseStore(i: IStore) {
    // SBNZ [1] [sp] #src X
    this.heap.push(this.refNum(1));
    this.heap.push(this.sp);
    this.heap.push(this.heap.length + 7);
    this.heap.push(this.heap.length + 1);
    // SBNZ [-var] [lv] #dst X
    this.heap.push(this.refNum(-i.index));
    this.heap.push(this.lv);
    this.heap.push(this.heap.length + 4);
    this.heap.push(this.heap.length + 1);
    // SBNZ [0] src dst X
    this.heap.push(this.refNum(0));
    this.heap.push(9999);
    this.heap.push(9999);
    this.heap.push(this.heap.length + 1);
    // SBNZ [1] [sp] [sp] X
    this.heap.push(this.refNum(1));
    this.heap.push(this.sp);
    this.heap.push(this.sp);
    this.heap.push(this.heap.length + 1);
  }
  caseReturn(i: IReturn) {
    // SBNZ [1] [sp] #srcRet X
    this.heap.push(this.refNum(1));
    this.heap.push(this.sp);
    this.heap.push(this.heap.length + 23);
    this.heap.push(this.heap.length + 1);
    // SBNZ [0] [lv] #clv X
    this.heap.push(this.refNum(0));
    this.heap.push(this.lv);
    this.heap.push(this.heap.length + 20);
    this.heap.push(this.heap.length + 1);
    // SBNZ [2] [sp] #srcLv X
    this.heap.push(this.refNum(2));
    this.heap.push(this.sp);
    this.heap.push(this.heap.length + 19);
    this.heap.push(this.heap.length + 1);
    // SBNZ [3] [sp] #srcPc X
    this.heap.push(this.refNum(3));
    this.heap.push(this.sp);
    this.heap.push(this.heap.length + 3);
    this.heap.push(this.heap.length + 1);
    // SBNZ [0] srcPc #dstPc X
    this.heap.push(this.refNum(0));
    this.heap.push(9999);
    this.heap.push(this.heap.length + 17);
    this.heap.push(this.heap.length + 1);
    // SBNZ [0] [lv] [sp] X
    this.heap.push(this.refNum(-1));
    this.heap.push(this.lv);
    this.heap.push(this.sp);
    this.heap.push(this.heap.length + 1);
    // SBNZ [0] srcRet clv X
    this.heap.push(this.refNum(0));
    this.heap.push(9999);
    this.heap.push(9999);
    this.heap.push(this.heap.length + 1);
    // SBNZ [0] srcLv [lv] X
    this.heap.push(this.refNum(0));
    this.heap.push(9999);
    this.heap.push(this.lv);
    this.heap.push(this.heap.length + 1);
    // SBNZ [0] [1] [1] dstPc
    this.heap.push(this.refNum(0));
    this.heap.push(this.refNum(1));
    this.heap.push(this.refNum(1));
    this.heap.push(9999);
  }
  caseCall(i: ICall) {
    let info = this.funcs[i.name] || { locals: 0, loc: 0, params: 0 };
    // push current lv
    // SBNZ [-locals-1] [sp] #dst X
    this.heap.push(this.refNum(-info.locals - 1));
    this.heap.push(this.sp);
    this.heap.push(this.heap.length + 4);
    this.heap.push(this.heap.length + 1);
    // SBNZ [0] [lv] dst X
    this.heap.push(this.refNum(0));
    this.heap.push(this.lv);
    this.heap.push(9999);
    this.heap.push(this.heap.length + 1);
    // push current pc
    // SBNZ [-locals-0] [sp] #dst X
    this.heap.push(this.refNum(-info.locals - 0));
    this.heap.push(this.sp);
    this.heap.push(this.heap.length + 4);
    this.heap.push(this.heap.length + 1);
    // SBNZ [0] #end dst X
    this.heap.push(this.refNum(0));
    this.heap.push(this.refNum(this.heap.length + 15));
    this.heap.push(9999);
    this.heap.push(this.heap.length + 1);
    // lv := sp
    // SBNZ [params] [sp] [lv] X
    this.heap.push(this.refNum(info.params));
    this.heap.push(this.sp);
    this.heap.push(this.lv);
    this.heap.push(this.heap.length + 1);
    // update sp
    // SBNZ [-locals-2] [sp] [sp] +4
    this.heap.push(this.refNum(-info.locals - 2));
    this.heap.push(this.sp);
    this.heap.push(this.sp);
    this.heap.push(this.heap.length + 1);
    // jmp
    // SBNZ [0] [1] [1] -1
    this.heap.push(this.refNum(0));
    this.heap.push(this.refNum(1));
    this.heap.push(this.refNum(1));
    this.heap.push(info.loc);
    // end
  }
  caseLabel(i: Label) {
    this.labels[i.label] = this.heap.length;
  }
  casePush(i: IPush) {
    // SBNZ [0] [sp] #loc +4
    this.heap.push(this.refNum(0));
    this.heap.push(this.sp);
    this.heap.push(this.heap.length + 4);
    this.heap.push(this.heap.length + 1);
    // SBNZ [0] [arg] 9999 +4
    this.heap.push(this.refNum(0));
    this.heap.push(this.refNum(i.arg));
    this.heap.push(9999);
    this.heap.push(this.heap.length + 1);
    // SBNZ [-1] [sp] [sp] +4
    this.heap.push(this.refNum(-1));
    this.heap.push(this.sp);
    this.heap.push(this.sp);
    this.heap.push(this.heap.length + 1);
  }
  casePop(i: IPop) {
    // SBNZ [1] [sp] [sp] +4
    this.heap.push(this.refNum(1));
    this.heap.push(this.sp);
    this.heap.push(this.sp);
    this.heap.push(this.heap.length + 1);
  }
  caseSub(i: ISub) {
    // SBNZ [1] [sp] #a X
    this.heap.push(this.refNum(1));
    this.heap.push(this.sp);
    this.heap.push(this.heap.length + 10);
    this.heap.push(this.heap.length + 1);
    // SBNZ [2] [sp] #b X
    this.heap.push(this.refNum(2));
    this.heap.push(this.sp);
    this.heap.push(this.heap.length + 7);
    this.heap.push(this.heap.length + 1);
    // SBNZ [2] [sp] #dst X
    this.heap.push(this.refNum(2));
    this.heap.push(this.sp);
    this.heap.push(this.heap.length + 4);
    this.heap.push(this.heap.length + 1);
    // SBNZ a b dst X
    this.heap.push(9999);
    this.heap.push(9999);
    this.heap.push(9999);
    this.heap.push(this.heap.length + 1);
    // SBNZ [1] [sp] [sp] +4
    this.heap.push(this.refNum(1));
    this.heap.push(this.sp);
    this.heap.push(this.sp);
    this.heap.push(this.heap.length + 1);
  }
  caseDup(i: ISwap) {
    // SBNZ [1] [sp] #src X
    this.heap.push(this.refNum(1));
    this.heap.push(this.sp);
    this.heap.push(this.heap.length + 7);
    this.heap.push(this.heap.length + 1);
    // SBNZ [0] [sp] #dst X
    this.heap.push(this.refNum(0));
    this.heap.push(this.sp);
    this.heap.push(this.heap.length + 4);
    this.heap.push(this.heap.length + 1);
    // SBNZ [0] src dst X
    this.heap.push(this.refNum(0));
    this.heap.push(9999);
    this.heap.push(9999);
    this.heap.push(this.heap.length + 1);
    // SBNZ [-1] [sp] [sp] +4
    this.heap.push(this.refNum(-1));
    this.heap.push(this.sp);
    this.heap.push(this.sp);
    this.heap.push(this.heap.length + 1);
  }
  caseSwap(i: ISwap) {
    // SBNZ [2] [sp] #src X
    this.heap.push(this.refNum(2));
    this.heap.push(this.sp);
    this.heap.push(this.heap.length + 7);
    this.heap.push(this.heap.length + 1);
    // SBNZ [0] [sp] #dst X
    this.heap.push(this.refNum(0));
    this.heap.push(this.sp);
    this.heap.push(this.heap.length + 4);
    this.heap.push(this.heap.length + 1);
    // SBNZ [0] src dst X
    this.heap.push(this.refNum(0));
    this.heap.push(9999);
    this.heap.push(9999);
    this.heap.push(this.heap.length + 1);
    //
    // SBNZ [1] [sp] #src X
    this.heap.push(this.refNum(1));
    this.heap.push(this.sp);
    this.heap.push(this.heap.length + 7);
    this.heap.push(this.heap.length + 1);
    // SBNZ [2] [sp] #dst X
    this.heap.push(this.refNum(2));
    this.heap.push(this.sp);
    this.heap.push(this.heap.length + 4);
    this.heap.push(this.heap.length + 1);
    // SBNZ [0] src dst X
    this.heap.push(this.refNum(0));
    this.heap.push(9999);
    this.heap.push(9999);
    this.heap.push(this.heap.length + 1);
    //
    // SBNZ [0] [sp] #src X
    this.heap.push(this.refNum(0));
    this.heap.push(this.sp);
    this.heap.push(this.heap.length + 7);
    this.heap.push(this.heap.length + 1);
    // SBNZ [1] [sp] #dst X
    this.heap.push(this.refNum(1));
    this.heap.push(this.sp);
    this.heap.push(this.heap.length + 4);
    this.heap.push(this.heap.length + 1);
    // SBNZ [0] src dst X
    this.heap.push(this.refNum(0));
    this.heap.push(9999);
    this.heap.push(9999);
    this.heap.push(this.heap.length + 1);
  }
  caseJmp(i: IJmp) {
    // SBNZ [0] [1] [1] -1
    this.heap.push(this.refNum(0));
    this.heap.push(this.refNum(1));
    this.heap.push(this.refNum(1));
    this.heap.push(this.labels[i.label]);
  }
  caseZero(i: IZero) {
    // SBNZ [1] [sp] [sp] X
    this.heap.push(this.refNum(1));
    this.heap.push(this.sp);
    this.heap.push(this.sp);
    this.heap.push(this.heap.length + 1);
    // SBNZ [0] [sp] #dst X
    this.heap.push(this.refNum(0));
    this.heap.push(this.sp);
    this.heap.push(this.heap.length + 7);
    this.heap.push(this.heap.length + 1);
    // SBNZ [0] [sp] #dst2 X
    this.heap.push(this.refNum(0));
    this.heap.push(this.sp);
    this.heap.push(this.heap.length + 4);
    this.heap.push(this.heap.length + 1);
    // SBNZ [0] dst dst2 false
    this.heap.push(this.refNum(0));
    this.heap.push(9999);
    this.heap.push(9999);
    this.heap.push(this.labels[i.lFalse]);
    // SBNZ [0] [1] [1] true
    this.heap.push(this.refNum(0));
    this.heap.push(this.refNum(1));
    this.heap.push(this.refNum(1));
    this.heap.push(this.labels[i.lTrue]);
  }
  refNum(arg: number) {
    let index = this.constants.indexOf(arg);
    if (index < 0) {
      index = this.constants.length;
      this.constants.push(arg);
    }
    return index + this.constantPoolStart;
  }
}

class VariableCheck extends Analysis<void> {
  private locals = 0;
  private errors: string[] = [];
  // TODO check initialized
  caseFunc(i: Func) {
    this.locals = i.locals + i.params;
  }
  caseLoad(i: ILoad) {
    if (i.index < 0 || i.index >= this.locals)
      this.errors.push("Accessing illegal variable on line " + i.lineNumber);
  }
  caseStore(i: IStore) {
    if (i.index < 0 || i.index >= this.locals)
      this.errors.push("Accessing illegal variable on line " + i.lineNumber);
  }
  after() {
    if (this.errors.length > 0) {
      throw this.errors.join("\n");
    }
  }
}

interface Env {
  funcs: { [name: string]: Func };
  labels: { [name: string]: number };
}
class Environment extends Analysis<Env> {
  private env: Env = { funcs: {}, labels: {} };
  private index = 0;
  default() {
    this.index++;
  }
  after() {
    return this.env;
  }
  caseFunc(i: Func) {
    this.env.funcs[i.name] = i;
    this.index++;
  }
  caseLabel(i: Label) {
    this.env.labels[i.label] = this.index;
    this.index++;
  }
  // TODO check jmp, labels and calls
}

class Node<T> {
  private next: Node<T>[] = [];
  constructor(private value: T) {}
  addNext(n: Node<T>) {
    this.next.push(n);
  }
}

class StackHeightVisitor implements Visitor<number> {
  constructor(private env: Env, private current: number) {}
  caseLabel(i: Label) {
    return 0;
  }
  caseFunc(i: Func) {
    return -this.current;
  }
  caseReturn(i: IReturn) {
    if (this.current !== 1)
      throw `${this.current} values on the stack at return on line ${i.lineNumber}`;
    return Number.NEGATIVE_INFINITY;
  }
  caseCall(i: ICall) {
    return -env.funcs[i.name].params + 1;
  }
  caseStore(i: IStore) {
    return -1;
  }
  caseLoad(i: ILoad) {
    return 1;
  }
  casePush(i: IPush) {
    return 1;
  }
  casePop(i: IPop) {
    return -1;
  }
  caseDup(i: IDup) {
    return 1;
  }
  caseSwap(i: ISwap) {
    return 0;
  }
  caseSub(i: ISub) {
    return -1;
  }
  caseJmp(i: IJmp) {
    return 0;
  }
  caseZero(i: IZero) {
    return -1;
  }
}

class NextVisitor implements Visitor<number[]> {
  constructor(private env: Env, private current: number) {}
  caseLabel(i: Label) {
    return [this.current + 1];
  }
  caseFunc(i: Func) {
    return [this.current + 1];
  }
  caseReturn(i: IReturn) {
    return [];
  }
  caseCall(i: ICall) {
    return [this.current + 1];
  }
  caseStore(i: IStore) {
    return [this.current + 1];
  }
  caseLoad(i: ILoad) {
    return [this.current + 1];
  }
  casePush(i: IPush) {
    return [this.current + 1];
  }
  casePop(i: IPop) {
    return [this.current + 1];
  }
  caseDup(i: IDup) {
    return [this.current + 1];
  }
  caseSwap(i: ISwap) {
    return [this.current + 1];
  }
  caseSub(i: ISub) {
    return [this.current + 1];
  }
  caseJmp(i: IJmp) {
    return [this.env.labels[i.label]];
  }
  caseZero(i: IZero) {
    return [this.env.labels[i.lTrue], this.env.labels[i.lFalse]];
  }
}

function propagate(env: Env, instrs: Instruction[], stackHeights: number[]) {
  let changed = false;
  for (let i = 0; i < instrs.length; i++) {
    let inst = instrs[i];
    let stackHeight = stackHeights[i];
    if (stackHeight === undefined) continue;
    stackHeight += inst.apply(new StackHeightVisitor(env, stackHeight));
    inst.apply(new NextVisitor(env, i)).forEach((x) => {
      if (stackHeights[x] === undefined) {
        stackHeights[x] = stackHeight;
        changed = true;
      } else if (stackHeights[x] !== stackHeight)
        throw `Illegal stack heights ${stackHeights[x]} and ${stackHeight} on line ${inst.lineNumber}`;
    });
  }
  return changed;
}

function stackHeightAnalysis(env: Env, instrs: Instruction[]) {
  let changed = true;
  let stackHeights: number[] = [0];
  while (changed) {
    changed = propagate(env, instrs, stackHeights);
  }
  let index = stackHeights.findIndex((x) => x < 0);
  if (index >= 0)
    throw "Stack underflow on line " + instrs[index - 1].lineNumber;
  console.log("Final stack height: " + stackHeights[stackHeights.length - 1]);
}

class StackHeight extends Analysis<void> {
  private stackHeight: number = 0;
  private labels: { [name: string]: number } = {};
  constructor(private env: Env) {
    super();
  }
  after() {}
  caseLabel(i: Label) {
    if (
      this.stackHeight !== Number.NEGATIVE_INFINITY &&
      this.labels[i.label] !== undefined &&
      this.labels[i.label] !== this.stackHeight
    )
      throw "Illegal stack height on line " + i.lineNumber;
    this.stackHeight = this.labels[i.label] || this.stackHeight;
  }
  caseFunc(i: Func) {
    this.stackHeight = 0;
  }
  caseReturn(i: IReturn) {
    if (this.stackHeight <= 0) throw "Stack underflow on line " + i.lineNumber;
    if (this.stackHeight > 1)
      throw "Illegal stack height on line " + i.lineNumber;
    this.stackHeight = Number.NEGATIVE_INFINITY;
  }
  caseCall(i: ICall) {
    if (this.stackHeight < this.env.funcs[i.name].params)
      throw "Stack underflow on line " + i.lineNumber;
    this.stackHeight -= this.env.funcs[i.name].params;
    this.stackHeight++;
  }
  caseStore(i: IStore) {
    if (this.stackHeight <= 0) throw "Stack underflow on line " + i.lineNumber;
    this.stackHeight--;
  }
  caseLoad(i: ILoad) {
    this.stackHeight++;
  }
  casePush(i: IPush) {
    this.stackHeight++;
  }
  casePop(i: IPop) {
    if (this.stackHeight <= 0) throw "Stack underflow on line " + i.lineNumber;
    this.stackHeight--;
  }
  caseDup(i: IDup) {
    if (this.stackHeight <= 0) throw "Stack underflow on line " + i.lineNumber;
    this.stackHeight++;
  }
  caseSwap(i: ISwap) {
    if (this.stackHeight < 2) throw "Stack underflow on line " + i.lineNumber;
  }
  caseSub(i: ISub) {
    if (this.stackHeight < 2) throw "Stack underflow on line " + i.lineNumber;
    this.stackHeight--;
  }
  caseJmp(i: IJmp) {
    if (
      this.labels[i.label] !== undefined &&
      this.labels[i.label] !== this.stackHeight
    )
      throw "Illegal stack height on line " + i.lineNumber;
    this.labels[i.label] = this.stackHeight;
    this.stackHeight = Number.NEGATIVE_INFINITY;
  }
  caseZero(i: IZero) {
    if (this.stackHeight <= 0) throw "Stack underflow on line " + i.lineNumber;
    this.stackHeight--;
    if (
      this.labels[i.lTrue] !== undefined &&
      this.labels[i.lTrue] !== this.stackHeight
    )
      throw (
        "Illegal stack height for label " + i.lTrue + " on line " + i.lineNumber
      );
    if (
      this.labels[i.lFalse] !== undefined &&
      this.labels[i.lFalse] !== this.stackHeight
    )
      throw (
        "Illegal stack height for label " +
        i.lFalse +
        " on line " +
        i.lineNumber
      );
    this.labels[i.lTrue] = this.stackHeight;
    this.labels[i.lFalse] = this.stackHeight;
    this.stackHeight = Number.NEGATIVE_INFINITY;
  }
}

let filename = process.argv[2];
let prog = new Parser(new Lexer(filename));
prog.parse();
prog.apply(new VariableCheck());
let env = prog.apply(new Environment());
stackHeightAnalysis(env, prog.getInstructions());
let codeGen = new CodeGeneration();
prog.apply(codeGen);
prog.apply(codeGen);
