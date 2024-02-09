export type NodeType =
  | "Program"
  | "VarDeclare"
  | "NumericLitral"
  | "Identifier"
  | "BinaryExpr"
  | "CallExpr"
  | "UnaryExp"
  | "FunctionDeclaration";

export interface Stmt {
  kind: NodeType;
}
export interface Program extends Stmt {
  kind: "Program";
  body: Stmt[];
}
export interface VarDeclare extends Stmt {
  kind: "VarDeclare";
  constant: boolean;
  ident: string;
  value?: Expr;
}
export interface Expr extends Stmt {}
export interface BinaryExpr extends Expr {
  kind: "BinaryExpr";
  left: Expr;
  right: Expr;
  operator: string;
}
export interface Identifier extends Expr {
  kind: "Identifier";
  symbol: string;
}
export interface NumericLitral extends Expr {
  kind: "NumericLitral";
  value: number;
}
