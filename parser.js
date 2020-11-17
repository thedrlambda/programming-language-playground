"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var lexer_1 = require("./lexer");
var Label = /** @class */ (function () {
    function Label(lineNumber, label) {
        this.lineNumber = lineNumber;
        this.label = label;
    }
    Label.prototype.apply = function (a) {
        return a.caseLabel(this);
    };
    return Label;
}());
var Func = /** @class */ (function () {
    function Func(lineNumber, name, params, locals) {
        this.lineNumber = lineNumber;
        this.name = name;
        this.params = params;
        this.locals = locals;
    }
    Func.prototype.apply = function (a) {
        return a.caseFunc(this);
    };
    return Func;
}());
var IReturn = /** @class */ (function () {
    function IReturn(lineNumber) {
        this.lineNumber = lineNumber;
    }
    IReturn.prototype.apply = function (a) {
        return a.caseReturn(this);
    };
    return IReturn;
}());
var ICall = /** @class */ (function () {
    function ICall(lineNumber, name) {
        this.lineNumber = lineNumber;
        this.name = name;
    }
    ICall.prototype.apply = function (a) {
        return a.caseCall(this);
    };
    return ICall;
}());
var IStore = /** @class */ (function () {
    function IStore(lineNumber, index) {
        this.lineNumber = lineNumber;
        this.index = index;
    }
    IStore.prototype.apply = function (a) {
        return a.caseStore(this);
    };
    return IStore;
}());
var ILoad = /** @class */ (function () {
    function ILoad(lineNumber, index) {
        this.lineNumber = lineNumber;
        this.index = index;
    }
    ILoad.prototype.apply = function (a) {
        return a.caseLoad(this);
    };
    return ILoad;
}());
var IPush = /** @class */ (function () {
    function IPush(lineNumber, arg) {
        this.lineNumber = lineNumber;
        this.arg = arg;
    }
    IPush.prototype.apply = function (a) {
        return a.casePush(this);
    };
    return IPush;
}());
var IPop = /** @class */ (function () {
    function IPop(lineNumber) {
        this.lineNumber = lineNumber;
    }
    IPop.prototype.apply = function (a) {
        return a.casePop(this);
    };
    return IPop;
}());
var IDup = /** @class */ (function () {
    function IDup(lineNumber) {
        this.lineNumber = lineNumber;
    }
    IDup.prototype.apply = function (a) {
        return a.caseDup(this);
    };
    return IDup;
}());
var ISwap = /** @class */ (function () {
    function ISwap(lineNumber) {
        this.lineNumber = lineNumber;
    }
    ISwap.prototype.apply = function (a) {
        return a.caseSwap(this);
    };
    return ISwap;
}());
var ISub = /** @class */ (function () {
    function ISub(lineNumber) {
        this.lineNumber = lineNumber;
    }
    ISub.prototype.apply = function (a) {
        return a.caseSub(this);
    };
    return ISub;
}());
var IJmp = /** @class */ (function () {
    function IJmp(lineNumber, label) {
        this.lineNumber = lineNumber;
        this.label = label;
    }
    IJmp.prototype.apply = function (a) {
        return a.caseJmp(this);
    };
    return IJmp;
}());
var IZero = /** @class */ (function () {
    function IZero(lineNumber, lTrue, lFalse) {
        this.lineNumber = lineNumber;
        this.lTrue = lTrue;
        this.lFalse = lFalse;
    }
    IZero.prototype.apply = function (a) {
        return a.caseZero(this);
    };
    return IZero;
}());
var Analysis = /** @class */ (function () {
    function Analysis() {
    }
    Analysis.prototype.default = function () { };
    Analysis.prototype.before = function () { };
    Analysis.prototype.caseLabel = function (i) {
        this.default();
    };
    Analysis.prototype.caseFunc = function (i) {
        this.default();
    };
    Analysis.prototype.caseReturn = function (i) {
        this.default();
    };
    Analysis.prototype.caseCall = function (i) {
        this.default();
    };
    Analysis.prototype.caseStore = function (i) {
        this.default();
    };
    Analysis.prototype.caseLoad = function (i) {
        this.default();
    };
    Analysis.prototype.casePush = function (i) {
        this.default();
    };
    Analysis.prototype.casePop = function (i) {
        this.default();
    };
    Analysis.prototype.caseDup = function (i) {
        this.default();
    };
    Analysis.prototype.caseSwap = function (i) {
        this.default();
    };
    Analysis.prototype.caseSub = function (i) {
        this.default();
    };
    Analysis.prototype.caseJmp = function (i) {
        this.default();
    };
    Analysis.prototype.caseZero = function (i) {
        this.default();
    };
    return Analysis;
}());
var Parser = /** @class */ (function () {
    function Parser(lexer) {
        this.lexer = lexer;
        this.instructions = [];
    }
    Parser.prototype.parse = function () {
        while (this.lexer.hasNext()) {
            var line = this.lexer.getLineNumber();
            if (this.lexer.consumeIf(":")) {
                var label = this.lexer.consumeId();
                this.instructions.push(new Label(line, label));
            }
            else if (this.lexer.consumeIf(".")) {
                var name_1 = this.lexer.consumeId();
                var params = this.lexer.consumeNumber();
                var locals = this.lexer.consumeNumber();
                this.instructions.push(new Func(line, name_1, params, locals));
            }
            else if (this.lexer.consumeIf("return")) {
                this.instructions.push(new IReturn(line));
            }
            else if (this.lexer.consumeIf("call")) {
                var name_2 = this.lexer.consumeId();
                this.instructions.push(new ICall(line, name_2));
            }
            else if (this.lexer.consumeIf("store")) {
                var v = this.lexer.consumeNumber();
                this.instructions.push(new IStore(line, v));
            }
            else if (this.lexer.consumeIf("load")) {
                var v = this.lexer.consumeNumber();
                this.instructions.push(new ILoad(line, v));
            }
            else if (this.lexer.consumeIf("push")) {
                var arg = this.lexer.consumeNumber();
                this.instructions.push(new IPush(line, arg));
            }
            else if (this.lexer.consumeIf("pop")) {
                this.instructions.push(new IPop(line));
            }
            else if (this.lexer.consumeIf("swap")) {
                this.instructions.push(new ISwap(line));
            }
            else if (this.lexer.consumeIf("dup")) {
                this.instructions.push(new IDup(line));
            }
            else if (this.lexer.consumeIf("sub")) {
                this.instructions.push(new ISub(line));
            }
            else if (this.lexer.consumeIf("jmp")) {
                var label = this.lexer.consumeId();
                this.instructions.push(new IJmp(line, label));
            }
            else if (this.lexer.consumeIf("zero")) {
                var label1 = this.lexer.consumeId();
                var label2 = this.lexer.consumeId();
                this.instructions.push(new IZero(line, label1, label2));
            }
            else {
                throw "Panic! '" + this.lexer.look() + "'";
            }
        }
    };
    Parser.prototype.apply = function (a) {
        a.before();
        this.instructions.forEach(function (i) { return i.apply(a); });
        return a.after();
    };
    Parser.prototype.getInstructions = function () {
        return this.instructions;
    };
    return Parser;
}());
var CodeGeneration = /** @class */ (function (_super) {
    __extends(CodeGeneration, _super);
    function CodeGeneration() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.heap = [];
        _this.constants = [];
        _this.constantPoolStart = 0;
        _this.sp = 0;
        _this.lv = 0;
        _this.labels = {};
        _this.funcs = {};
        return _this;
    }
    CodeGeneration.prototype.before = function () {
        this.heap = [];
    };
    CodeGeneration.prototype.after = function () {
        var _this = this;
        this.heap.push(this.refNum(0));
        this.heap.push(this.refNum(1));
        this.heap.push(this.refNum(1));
        this.heap.push(-1);
        this.constantPoolStart = this.heap.length;
        this.constants.forEach(function (x) { return _this.heap.push(x); });
        this.lv = this.heap.length;
        this.heap.push(this.lv + 1);
        this.sp = this.heap.length;
        this.heap.push(this.sp + 1);
        fs_1.default.writeFileSync("out.sbnz", this.heap.map(function (x) { return "" + x; }).join(" "));
    };
    CodeGeneration.prototype.caseFunc = function (i) {
        this.funcs[i.name] = {
            locals: i.locals,
            params: i.params,
            loc: this.heap.length,
        };
    };
    CodeGeneration.prototype.caseLoad = function (i) {
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
    };
    CodeGeneration.prototype.caseStore = function (i) {
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
    };
    CodeGeneration.prototype.caseReturn = function (i) {
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
    };
    CodeGeneration.prototype.caseCall = function (i) {
        var info = this.funcs[i.name] || { locals: 0, loc: 0, params: 0 };
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
    };
    CodeGeneration.prototype.caseLabel = function (i) {
        this.labels[i.label] = this.heap.length;
    };
    CodeGeneration.prototype.casePush = function (i) {
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
    };
    CodeGeneration.prototype.casePop = function (i) {
        // SBNZ [1] [sp] [sp] +4
        this.heap.push(this.refNum(1));
        this.heap.push(this.sp);
        this.heap.push(this.sp);
        this.heap.push(this.heap.length + 1);
    };
    CodeGeneration.prototype.caseSub = function (i) {
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
    };
    CodeGeneration.prototype.caseDup = function (i) {
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
    };
    CodeGeneration.prototype.caseSwap = function (i) {
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
    };
    CodeGeneration.prototype.caseJmp = function (i) {
        // SBNZ [0] [1] [1] -1
        this.heap.push(this.refNum(0));
        this.heap.push(this.refNum(1));
        this.heap.push(this.refNum(1));
        this.heap.push(this.labels[i.label]);
    };
    CodeGeneration.prototype.caseZero = function (i) {
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
    };
    CodeGeneration.prototype.refNum = function (arg) {
        var index = this.constants.indexOf(arg);
        if (index < 0) {
            index = this.constants.length;
            this.constants.push(arg);
        }
        return index + this.constantPoolStart;
    };
    return CodeGeneration;
}(Analysis));
var VariableCheck = /** @class */ (function (_super) {
    __extends(VariableCheck, _super);
    function VariableCheck() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.locals = 0;
        _this.errors = [];
        return _this;
    }
    // TODO check initialized
    VariableCheck.prototype.caseFunc = function (i) {
        this.locals = i.locals + i.params;
    };
    VariableCheck.prototype.caseLoad = function (i) {
        if (i.index < 0 || i.index >= this.locals)
            this.errors.push("Accessing illegal variable on line " + i.lineNumber);
    };
    VariableCheck.prototype.caseStore = function (i) {
        if (i.index < 0 || i.index >= this.locals)
            this.errors.push("Accessing illegal variable on line " + i.lineNumber);
    };
    VariableCheck.prototype.after = function () {
        if (this.errors.length > 0) {
            throw this.errors.join("\n");
        }
    };
    return VariableCheck;
}(Analysis));
var Environment = /** @class */ (function (_super) {
    __extends(Environment, _super);
    function Environment() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.env = { funcs: {}, labels: {} };
        _this.index = 0;
        return _this;
        // TODO check jmp, labels and calls
    }
    Environment.prototype.default = function () {
        this.index++;
    };
    Environment.prototype.after = function () {
        return this.env;
    };
    Environment.prototype.caseFunc = function (i) {
        this.env.funcs[i.name] = i;
        this.index++;
    };
    Environment.prototype.caseLabel = function (i) {
        this.env.labels[i.label] = this.index;
        this.index++;
    };
    return Environment;
}(Analysis));
var Node = /** @class */ (function () {
    function Node(value) {
        this.value = value;
        this.next = [];
    }
    Node.prototype.addNext = function (n) {
        this.next.push(n);
    };
    return Node;
}());
var StackHeightVisitor = /** @class */ (function () {
    function StackHeightVisitor(env, current) {
        this.env = env;
        this.current = current;
    }
    StackHeightVisitor.prototype.caseLabel = function (i) {
        return 0;
    };
    StackHeightVisitor.prototype.caseFunc = function (i) {
        return -this.current;
    };
    StackHeightVisitor.prototype.caseReturn = function (i) {
        if (this.current !== 1)
            throw this.current + " values on the stack at return on line " + i.lineNumber;
        return Number.NEGATIVE_INFINITY;
    };
    StackHeightVisitor.prototype.caseCall = function (i) {
        return -env.funcs[i.name].params + 1;
    };
    StackHeightVisitor.prototype.caseStore = function (i) {
        return -1;
    };
    StackHeightVisitor.prototype.caseLoad = function (i) {
        return 1;
    };
    StackHeightVisitor.prototype.casePush = function (i) {
        return 1;
    };
    StackHeightVisitor.prototype.casePop = function (i) {
        return -1;
    };
    StackHeightVisitor.prototype.caseDup = function (i) {
        return 1;
    };
    StackHeightVisitor.prototype.caseSwap = function (i) {
        return 0;
    };
    StackHeightVisitor.prototype.caseSub = function (i) {
        return -1;
    };
    StackHeightVisitor.prototype.caseJmp = function (i) {
        return 0;
    };
    StackHeightVisitor.prototype.caseZero = function (i) {
        return -1;
    };
    return StackHeightVisitor;
}());
var NextVisitor = /** @class */ (function () {
    function NextVisitor(env, current) {
        this.env = env;
        this.current = current;
    }
    NextVisitor.prototype.caseLabel = function (i) {
        return [this.current + 1];
    };
    NextVisitor.prototype.caseFunc = function (i) {
        return [this.current + 1];
    };
    NextVisitor.prototype.caseReturn = function (i) {
        return [];
    };
    NextVisitor.prototype.caseCall = function (i) {
        return [this.current + 1];
    };
    NextVisitor.prototype.caseStore = function (i) {
        return [this.current + 1];
    };
    NextVisitor.prototype.caseLoad = function (i) {
        return [this.current + 1];
    };
    NextVisitor.prototype.casePush = function (i) {
        return [this.current + 1];
    };
    NextVisitor.prototype.casePop = function (i) {
        return [this.current + 1];
    };
    NextVisitor.prototype.caseDup = function (i) {
        return [this.current + 1];
    };
    NextVisitor.prototype.caseSwap = function (i) {
        return [this.current + 1];
    };
    NextVisitor.prototype.caseSub = function (i) {
        return [this.current + 1];
    };
    NextVisitor.prototype.caseJmp = function (i) {
        return [this.env.labels[i.label]];
    };
    NextVisitor.prototype.caseZero = function (i) {
        return [this.env.labels[i.lTrue], this.env.labels[i.lFalse]];
    };
    return NextVisitor;
}());
function propagate(env, instrs, stackHeights) {
    var changed = false;
    var _loop_1 = function (i) {
        var inst = instrs[i];
        var stackHeight = stackHeights[i];
        if (stackHeight === undefined)
            return "continue";
        stackHeight += inst.apply(new StackHeightVisitor(env, stackHeight));
        inst.apply(new NextVisitor(env, i)).forEach(function (x) {
            if (stackHeights[x] === undefined) {
                stackHeights[x] = stackHeight;
                changed = true;
            }
            else if (stackHeights[x] !== stackHeight)
                throw "Illegal stack heights " + stackHeights[x] + " and " + stackHeight + " on line " + inst.lineNumber;
        });
    };
    for (var i = 0; i < instrs.length; i++) {
        _loop_1(i);
    }
    return changed;
}
function stackHeightAnalysis(env, instrs) {
    var changed = true;
    var stackHeights = [0];
    while (changed) {
        changed = propagate(env, instrs, stackHeights);
    }
    var index = stackHeights.findIndex(function (x) { return x < 0; });
    if (index >= 0)
        throw "Stack underflow on line " + instrs[index - 1].lineNumber;
    console.log("Final stack height: " + stackHeights[stackHeights.length - 1]);
}
var StackHeight = /** @class */ (function (_super) {
    __extends(StackHeight, _super);
    function StackHeight(env) {
        var _this = _super.call(this) || this;
        _this.env = env;
        _this.stackHeight = 0;
        _this.labels = {};
        return _this;
    }
    StackHeight.prototype.after = function () { };
    StackHeight.prototype.caseLabel = function (i) {
        if (this.stackHeight !== Number.NEGATIVE_INFINITY &&
            this.labels[i.label] !== undefined &&
            this.labels[i.label] !== this.stackHeight)
            throw "Illegal stack height on line " + i.lineNumber;
        this.stackHeight = this.labels[i.label] || this.stackHeight;
    };
    StackHeight.prototype.caseFunc = function (i) {
        this.stackHeight = 0;
    };
    StackHeight.prototype.caseReturn = function (i) {
        if (this.stackHeight <= 0)
            throw "Stack underflow on line " + i.lineNumber;
        if (this.stackHeight > 1)
            throw "Illegal stack height on line " + i.lineNumber;
        this.stackHeight = Number.NEGATIVE_INFINITY;
    };
    StackHeight.prototype.caseCall = function (i) {
        if (this.stackHeight < this.env.funcs[i.name].params)
            throw "Stack underflow on line " + i.lineNumber;
        this.stackHeight -= this.env.funcs[i.name].params;
        this.stackHeight++;
    };
    StackHeight.prototype.caseStore = function (i) {
        if (this.stackHeight <= 0)
            throw "Stack underflow on line " + i.lineNumber;
        this.stackHeight--;
    };
    StackHeight.prototype.caseLoad = function (i) {
        this.stackHeight++;
    };
    StackHeight.prototype.casePush = function (i) {
        this.stackHeight++;
    };
    StackHeight.prototype.casePop = function (i) {
        if (this.stackHeight <= 0)
            throw "Stack underflow on line " + i.lineNumber;
        this.stackHeight--;
    };
    StackHeight.prototype.caseDup = function (i) {
        if (this.stackHeight <= 0)
            throw "Stack underflow on line " + i.lineNumber;
        this.stackHeight++;
    };
    StackHeight.prototype.caseSwap = function (i) {
        if (this.stackHeight < 2)
            throw "Stack underflow on line " + i.lineNumber;
    };
    StackHeight.prototype.caseSub = function (i) {
        if (this.stackHeight < 2)
            throw "Stack underflow on line " + i.lineNumber;
        this.stackHeight--;
    };
    StackHeight.prototype.caseJmp = function (i) {
        if (this.labels[i.label] !== undefined &&
            this.labels[i.label] !== this.stackHeight)
            throw "Illegal stack height on line " + i.lineNumber;
        this.labels[i.label] = this.stackHeight;
        this.stackHeight = Number.NEGATIVE_INFINITY;
    };
    StackHeight.prototype.caseZero = function (i) {
        if (this.stackHeight <= 0)
            throw "Stack underflow on line " + i.lineNumber;
        this.stackHeight--;
        if (this.labels[i.lTrue] !== undefined &&
            this.labels[i.lTrue] !== this.stackHeight)
            throw ("Illegal stack height for label " + i.lTrue + " on line " + i.lineNumber);
        if (this.labels[i.lFalse] !== undefined &&
            this.labels[i.lFalse] !== this.stackHeight)
            throw ("Illegal stack height for label " +
                i.lFalse +
                " on line " +
                i.lineNumber);
        this.labels[i.lTrue] = this.stackHeight;
        this.labels[i.lFalse] = this.stackHeight;
        this.stackHeight = Number.NEGATIVE_INFINITY;
    };
    return StackHeight;
}(Analysis));
var filename = process.argv[2];
var prog = new Parser(new lexer_1.Lexer(filename));
prog.parse();
prog.apply(new VariableCheck());
var env = prog.apply(new Environment());
stackHeightAnalysis(env, prog.getInstructions());
var codeGen = new CodeGeneration();
prog.apply(codeGen);
prog.apply(codeGen);
