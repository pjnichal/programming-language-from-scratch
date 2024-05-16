export type NodeType =
  | "Program"
  | "VarDeclare"
  | "NumericLitral"
  | "FunctionDeclare"
  | "Identifier"
  | "BinaryExpr"
  | "CallExpr"
  | "Property"
  | "ObjectLiteral"
  | "UnaryExpr"
  | "MemberExpr"
  | "CallExpr"
  | "AssignmentExpr"
  | "IfStmt";

export interface Stmt {
  kind: NodeType;
}
export interface Program extends Stmt {
  kind: "Program";
  body: Stmt[];
}
export interface AssignmentExpr extends Expr {
  kind: "AssignmentExpr";
  assigne: Expr;
  value: Expr;
}
export interface VarDeclare extends Stmt {
  kind: "VarDeclare";
  constant: boolean;
  ident: string;
  value?: Expr;
}
export interface FunctionDeclare extends Stmt {
  kind: "FunctionDeclare";
  parameter: string[];
  name: string;
  body: Stmt[];
}
export interface Expr extends Stmt {}
export interface IfStmt extends Stmt {
  kind: "IfStmt";
  then: Stmt[];
  else: Stmt[];
  condition: Expr;
}
export interface BinaryExpr extends Expr {
  kind: "BinaryExpr";
  left: Expr;
  right: Expr;
  operator: string;
}
export interface CallExpr extends Expr {
  kind: "CallExpr";
  arguments: Expr[];
  caller: Expr;
  operator: string;
}
export interface MemberExpr extends Expr {
  kind: "MemberExpr";
  object: Expr;
  property: Expr;
  computed: boolean;
}
export interface Identifier extends Expr {
  kind: "Identifier";
  symbol: string;
}
export interface NumericLitral extends Expr {
  kind: "NumericLitral";
  value: number;
}
export interface ObjectLiteral extends Expr {
  kind: "ObjectLiteral";
  properties: Property[];
}

export interface Property extends Expr {
  kind: "Property";
  key: string;
  value?: Expr;
}
