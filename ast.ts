import * as CParser from "./cparser";
export type ident = CParser.ident;
export interface Visitor {
  inSub(a: Sub): void;
  outSub(a: Sub): void;
  inCall(a: Call): void;
  outCall(a: Call): void;
  inNumberExpr(a: NumberExpr): void;
  outNumberExpr(a: NumberExpr): void;
  inVar(a: Var): void;
  outVar(a: Var): void;
  inAssignment(a: Assignment): void;
  outAssignment(a: Assignment): void;
  inIf(a: If): void;
  outIf(a: If): void;
  inIfElse(a: IfElse): void;
  outIfElse(a: IfElse): void;
  inWhile(a: While): void;
  outWhile(a: While): void;
  inDecl(a: Decl): void;
  outDecl(a: Decl): void;
  inExprStmt(a: ExprStmt): void;
  outExprStmt(a: ExprStmt): void;
  inReturn(a: Return): void;
  outReturn(a: Return): void;
  inBlock(a: Block): void;
  outBlock(a: Block): void;
  inFunction(a: Function): void;
  outFunction(a: Function): void;
}
export interface Expr {
  apply(a: Visitor): void;
}
export class Sub implements Expr {
  constructor(public readonly left: Expr, public readonly right: Expr) {}
  apply(a: Visitor) {
    a.inSub(this);
    this.left.apply(a);
    this.right.apply(a);
    a.outSub(this);
  }
}
export class NumberExpr implements Expr {
  constructor(public readonly value: number) {}
  apply(a: Visitor) {
    a.inNumberExpr(this);
    a.outNumberExpr(this);
  }
}
export class Var implements Expr {
  constructor(public readonly name: ident) {}
  apply(a: Visitor) {
    a.inVar(this);
    a.outVar(this);
  }
}
export class Call implements Expr {
  constructor(public readonly func: ident, public readonly args: Expr[]) {}
  apply(a: Visitor) {
    a.inCall(this);
    this.args.forEach((x) => x.apply(a));
    a.outCall(this);
  }
}
export class Assignment implements Expr {
  constructor(public readonly assignee: ident, public readonly expr: Expr) {}
  apply(a: Visitor) {
    a.inAssignment(this);
    this.expr.apply(a);
    a.outAssignment(this);
  }
}

export interface Stmt {
  apply(a: Visitor): void;
}
export class If implements Stmt {
  constructor(public readonly condition: Expr, public readonly body: Stmt) {}
  apply(a: Visitor) {
    a.inIf(this);
    this.condition.apply(a);
    this.body.apply(a);
    a.outIf(this);
  }
}
export class IfElse implements Stmt {
  constructor(
    public readonly condition: Expr,
    public readonly then: Stmt,
    public readonly else_: Stmt
  ) {}
  apply(a: Visitor) {
    a.inIfElse(this);
    this.condition.apply(a);
    this.then.apply(a);
    this.else_.apply(a);
    a.outIfElse(this);
  }
}
export class Decl implements Stmt {
  constructor(public readonly assignee: ident, public readonly expr: Expr) {}
  apply(a: Visitor) {
    a.inDecl(this);
    this.expr.apply(a);
    a.outDecl(this);
  }
}
export class While implements Stmt {
  constructor(public readonly condition: Expr, public readonly body: Stmt) {}
  apply(a: Visitor) {
    a.inWhile(this);
    this.condition.apply(a);
    this.body.apply(a);
    a.outWhile(this);
  }
}
export class Return implements Stmt {
  constructor(public readonly expr: Expr) {}
  apply(a: Visitor) {
    a.inReturn(this);
    this.expr.apply(a);
    a.outReturn(this);
  }
}
export class ExprStmt implements Stmt {
  constructor(public readonly expr: Expr) {}
  apply(a: Visitor) {
    a.inExprStmt(this);
    this.expr.apply(a);
    a.outExprStmt(this);
  }
}
export class Block implements Stmt {
  constructor(public readonly block: Stmt[]) {}
  apply(a: Visitor) {
    a.inBlock(this);
    this.block.forEach((x) => x.apply(a));
    a.outBlock(this);
  }
}

export interface TopLevel {
  apply(a: Visitor): void;
}
export class Function implements TopLevel {
  constructor(
    public readonly name: ident,
    public readonly params: ident[],
    public readonly body: Stmt[]
  ) {}
  apply(a: Visitor) {
    a.inFunction(this);
    this.body.forEach((x) => x.apply(a));
    a.outFunction(this);
  }
}
