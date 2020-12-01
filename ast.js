"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Function = exports.Block = exports.ExprStmt = exports.Return = exports.While = exports.Decl = exports.IfElse = exports.If = exports.Assignment = exports.Call = exports.Var = exports.NumberExpr = exports.Sub = void 0;
var Sub = /** @class */ (function () {
    function Sub(left, right) {
        this.left = left;
        this.right = right;
    }
    Sub.prototype.apply = function (a) {
        a.inSub(this);
        this.left.apply(a);
        this.right.apply(a);
        a.outSub(this);
    };
    return Sub;
}());
exports.Sub = Sub;
var NumberExpr = /** @class */ (function () {
    function NumberExpr(value) {
        this.value = value;
    }
    NumberExpr.prototype.apply = function (a) {
        a.inNumberExpr(this);
        a.outNumberExpr(this);
    };
    return NumberExpr;
}());
exports.NumberExpr = NumberExpr;
var Var = /** @class */ (function () {
    function Var(name) {
        this.name = name;
    }
    Var.prototype.apply = function (a) {
        a.inVar(this);
        a.outVar(this);
    };
    return Var;
}());
exports.Var = Var;
var Call = /** @class */ (function () {
    function Call(func, args) {
        this.func = func;
        this.args = args;
    }
    Call.prototype.apply = function (a) {
        a.inCall(this);
        this.args.forEach(function (x) { return x.apply(a); });
        a.outCall(this);
    };
    return Call;
}());
exports.Call = Call;
var Assignment = /** @class */ (function () {
    function Assignment(assignee, expr) {
        this.assignee = assignee;
        this.expr = expr;
    }
    Assignment.prototype.apply = function (a) {
        a.inAssignment(this);
        this.expr.apply(a);
        a.outAssignment(this);
    };
    return Assignment;
}());
exports.Assignment = Assignment;
var If = /** @class */ (function () {
    function If(condition, body) {
        this.condition = condition;
        this.body = body;
    }
    If.prototype.apply = function (a) {
        a.inIf(this);
        this.condition.apply(a);
        this.body.apply(a);
        a.outIf(this);
    };
    return If;
}());
exports.If = If;
var IfElse = /** @class */ (function () {
    function IfElse(condition, then, else_) {
        this.condition = condition;
        this.then = then;
        this.else_ = else_;
    }
    IfElse.prototype.apply = function (a) {
        a.inIfElse(this);
        this.condition.apply(a);
        this.then.apply(a);
        this.else_.apply(a);
        a.outIfElse(this);
    };
    return IfElse;
}());
exports.IfElse = IfElse;
var Decl = /** @class */ (function () {
    function Decl(assignee, expr) {
        this.assignee = assignee;
        this.expr = expr;
    }
    Decl.prototype.apply = function (a) {
        a.inDecl(this);
        this.expr.apply(a);
        a.outDecl(this);
    };
    return Decl;
}());
exports.Decl = Decl;
var While = /** @class */ (function () {
    function While(condition, body) {
        this.condition = condition;
        this.body = body;
    }
    While.prototype.apply = function (a) {
        a.inWhile(this);
        this.condition.apply(a);
        this.body.apply(a);
        a.outWhile(this);
    };
    return While;
}());
exports.While = While;
var Return = /** @class */ (function () {
    function Return(expr) {
        this.expr = expr;
    }
    Return.prototype.apply = function (a) {
        a.inReturn(this);
        this.expr.apply(a);
        a.outReturn(this);
    };
    return Return;
}());
exports.Return = Return;
var ExprStmt = /** @class */ (function () {
    function ExprStmt(expr) {
        this.expr = expr;
    }
    ExprStmt.prototype.apply = function (a) {
        a.inExprStmt(this);
        this.expr.apply(a);
        a.outExprStmt(this);
    };
    return ExprStmt;
}());
exports.ExprStmt = ExprStmt;
var Block = /** @class */ (function () {
    function Block(block) {
        this.block = block;
    }
    Block.prototype.apply = function (a) {
        a.inBlock(this);
        this.block.forEach(function (x) { return x.apply(a); });
        a.outBlock(this);
    };
    return Block;
}());
exports.Block = Block;
var Function = /** @class */ (function () {
    function Function(name, params, body) {
        this.name = name;
        this.params = params;
        this.body = body;
    }
    Function.prototype.apply = function (a) {
        a.inFunction(this);
        this.body.forEach(function (x) { return x.apply(a); });
        a.outFunction(this);
    };
    return Function;
}());
exports.Function = Function;
