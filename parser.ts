import { constants } from "buffer";
import fs from "fs";
import { Lexer } from "./lexer";

interface Instruction {
  apply(a: Analysis): void;
}
class Label implements Instruction {
  constructor(public readonly label: string) {}
  apply(a: Analysis) {
    a.caseLabel(this);
  }
}

class Func implements Instruction {
  constructor(
    public readonly name: string,
    public readonly params: number,
    public readonly locals: number
  ) {}
  apply(a: Analysis) {
    a.caseFunc(this);
  }
}
class IReturn implements Instruction {
  apply(a: Analysis) {
    a.caseReturn(this);
  }
}
class ICall implements Instruction {
  constructor(public readonly name: string) {}
  apply(a: Analysis) {
    a.caseCall(this);
  }
}

class IStore implements Instruction {
  constructor(public readonly index: number) {}
  apply(a: Analysis) {
    a.caseStore(this);
  }
}
class ILoad implements Instruction {
  constructor(public readonly index: number) {}
  apply(a: Analysis) {
    a.caseLoad(this);
  }
}

class IPush implements Instruction {
  constructor(public readonly arg: number) {}
  apply(a: Analysis) {
    a.casePush(this);
  }
}
class IPop implements Instruction {
  apply(a: Analysis) {
    a.casePop(this);
  }
}
class IDup implements Instruction {
  apply(a: Analysis) {
    a.caseDup(this);
  }
}
class ISwap implements Instruction {
  apply(a: Analysis) {
    a.caseSwap(this);
  }
}
class ISub implements Instruction {
  apply(a: Analysis) {
    a.caseSub(this);
  }
}

class IJmp implements Instruction {
  constructor(public readonly label: string) {}
  apply(a: Analysis) {
    a.caseJmp(this);
  }
}
class IZero implements Instruction {
  constructor(public readonly lTrue: string, public readonly lFalse: string) {}
  apply(a: Analysis) {
    a.caseZero(this);
  }
}

class Analysis {
  default() {}
  before() {}
  after() {}
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
      if (this.lexer.consumeIf(":")) {
        let label = this.lexer.consumeId();
        this.instructions.push(new Label(label));
      } else if (this.lexer.consumeIf(".")) {
        let name = this.lexer.consumeId();
        let params = this.lexer.consumeNumber();
        let locals = this.lexer.consumeNumber();
        this.instructions.push(new Func(name, params, locals));
      } else if (this.lexer.consumeIf("return")) {
        this.instructions.push(new IReturn());
      } else if (this.lexer.consumeIf("call")) {
        let name = this.lexer.consumeId();
        this.instructions.push(new ICall(name));
      } else if (this.lexer.consumeIf("store")) {
        let v = this.lexer.consumeNumber();
        this.instructions.push(new IStore(v));
      } else if (this.lexer.consumeIf("load")) {
        let v = this.lexer.consumeNumber();
        this.instructions.push(new ILoad(v));
      } else if (this.lexer.consumeIf("push")) {
        let arg = this.lexer.consumeNumber();
        this.instructions.push(new IPush(arg));
      } else if (this.lexer.consumeIf("pop")) {
        this.instructions.push(new IPop());
      } else if (this.lexer.consumeIf("swap")) {
        this.instructions.push(new ISwap());
      } else if (this.lexer.consumeIf("dup")) {
        this.instructions.push(new IDup());
      } else if (this.lexer.consumeIf("sub")) {
        this.instructions.push(new ISub());
      } else if (this.lexer.consumeIf("jmp")) {
        let label = this.lexer.consumeId();
        this.instructions.push(new IJmp(label));
      } else if (this.lexer.consumeIf("zero")) {
        let label1 = this.lexer.consumeId();
        let label2 = this.lexer.consumeId();
        this.instructions.push(new IZero(label1, label2));
      } else {
        throw `Panic! '${this.lexer.look()}'`;
      }
    }
  }
  apply(a: Analysis) {
    a.before();
    this.instructions.forEach((i) => i.apply(a));
    a.after();
  }
}

class CodeGeneration extends Analysis {
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
    let info = this.funcs[i.name];
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

let filename = process.argv[2];
let prog = new Parser(new Lexer(filename));
prog.parse();
let codeGen = new CodeGeneration();
prog.apply(codeGen);
prog.apply(codeGen);
