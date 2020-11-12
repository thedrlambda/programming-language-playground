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
    function Label(label) {
        this.label = label;
    }
    Label.prototype.apply = function (a) {
        a.caseLabel(this);
    };
    return Label;
}());
var Func = /** @class */ (function () {
    function Func(name, params, locals) {
        this.name = name;
        this.params = params;
        this.locals = locals;
    }
    Func.prototype.apply = function (a) {
        a.caseFunc(this);
    };
    return Func;
}());
var IReturn = /** @class */ (function () {
    function IReturn() {
    }
    IReturn.prototype.apply = function (a) {
        a.caseReturn(this);
    };
    return IReturn;
}());
var ICall = /** @class */ (function () {
    function ICall(name) {
        this.name = name;
    }
    ICall.prototype.apply = function (a) {
        a.caseCall(this);
    };
    return ICall;
}());
var IStore = /** @class */ (function () {
    function IStore(index) {
        this.index = index;
    }
    IStore.prototype.apply = function (a) {
        a.caseStore(this);
    };
    return IStore;
}());
var ILoad = /** @class */ (function () {
    function ILoad(index) {
        this.index = index;
    }
    ILoad.prototype.apply = function (a) {
        a.caseLoad(this);
    };
    return ILoad;
}());
var IPush = /** @class */ (function () {
    function IPush(arg) {
        this.arg = arg;
    }
    IPush.prototype.apply = function (a) {
        a.casePush(this);
    };
    return IPush;
}());
var IPop = /** @class */ (function () {
    function IPop() {
    }
    IPop.prototype.apply = function (a) {
        a.casePop(this);
    };
    return IPop;
}());
var IDup = /** @class */ (function () {
    function IDup() {
    }
    IDup.prototype.apply = function (a) {
        a.caseDup(this);
    };
    return IDup;
}());
var ISwap = /** @class */ (function () {
    function ISwap() {
    }
    ISwap.prototype.apply = function (a) {
        a.caseSwap(this);
    };
    return ISwap;
}());
var ISub = /** @class */ (function () {
    function ISub() {
    }
    ISub.prototype.apply = function (a) {
        a.caseSub(this);
    };
    return ISub;
}());
var IJmp = /** @class */ (function () {
    function IJmp(label) {
        this.label = label;
    }
    IJmp.prototype.apply = function (a) {
        a.caseJmp(this);
    };
    return IJmp;
}());
var IZero = /** @class */ (function () {
    function IZero(lTrue, lFalse) {
        this.lTrue = lTrue;
        this.lFalse = lFalse;
    }
    IZero.prototype.apply = function (a) {
        a.caseZero(this);
    };
    return IZero;
}());
var Analysis = /** @class */ (function () {
    function Analysis() {
    }
    Analysis.prototype.default = function () { };
    Analysis.prototype.before = function () { };
    Analysis.prototype.after = function () { };
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
            if (this.lexer.consumeIf(":")) {
                var label = this.lexer.consumeId();
                this.instructions.push(new Label(label));
            }
            else if (this.lexer.consumeIf(".")) {
                var name_1 = this.lexer.consumeId();
                var params = this.lexer.consumeNumber();
                var locals = this.lexer.consumeNumber();
                this.instructions.push(new Func(name_1, params, locals));
            }
            else if (this.lexer.consumeIf("return")) {
                this.instructions.push(new IReturn());
            }
            else if (this.lexer.consumeIf("call")) {
                var name_2 = this.lexer.consumeId();
                this.instructions.push(new ICall(name_2));
            }
            else if (this.lexer.consumeIf("store")) {
                var v = this.lexer.consumeNumber();
                this.instructions.push(new IStore(v));
            }
            else if (this.lexer.consumeIf("load")) {
                var v = this.lexer.consumeNumber();
                this.instructions.push(new ILoad(v));
            }
            else if (this.lexer.consumeIf("push")) {
                var arg = this.lexer.consumeNumber();
                this.instructions.push(new IPush(arg));
            }
            else if (this.lexer.consumeIf("pop")) {
                this.instructions.push(new IPop());
            }
            else if (this.lexer.consumeIf("swap")) {
                this.instructions.push(new ISwap());
            }
            else if (this.lexer.consumeIf("dup")) {
                this.instructions.push(new IDup());
            }
            else if (this.lexer.consumeIf("sub")) {
                this.instructions.push(new ISub());
            }
            else if (this.lexer.consumeIf("jmp")) {
                var label = this.lexer.consumeId();
                this.instructions.push(new IJmp(label));
            }
            else if (this.lexer.consumeIf("zero")) {
                var label1 = this.lexer.consumeId();
                var label2 = this.lexer.consumeId();
                this.instructions.push(new IZero(label1, label2));
            }
            else {
                throw "Panic! '" + this.lexer.look() + "'";
            }
        }
    };
    Parser.prototype.apply = function (a) {
        a.before();
        this.instructions.forEach(function (i) { return i.apply(a); });
        a.after();
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
        var info = this.funcs[i.name];
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
var filename = process.argv[2];
var prog = new Parser(new lexer_1.Lexer(filename));
prog.parse();
var codeGen = new CodeGeneration();
prog.apply(codeGen);
prog.apply(codeGen);
