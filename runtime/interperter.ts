import { ValueType, RuntimeVal, NumberVal, NullVal, MK_NULL } from "./values";
import {
  AssignmentExpr,
  BinaryExpr,
  CallExpr,
  Identifier,
  NumericLitral,
  ObjectLiteral,
  Program,
  Stmt,
  VarDeclare,
} from "../frontend/ast";
import Environment from "./environment";
import { evaluate_program, evaluate_var_declaration } from "./eval/statement";
import {
  evaluate_assigment,
  evaluate_binary_expr,
  evaluate_ident,
  evaluate_object_expr,
  evalue_call_expr,
} from "./eval/expression";

export function evaluate(astNode: Stmt, env: Environment): RuntimeVal {
  switch (astNode.kind) {
    case "NumericLitral":
      return {
        value: (astNode as NumericLitral).value,
        type: "number",
      } as NumberVal;
    case "Identifier":
      return evaluate_ident(astNode as Identifier, env);
    case "ObjectLiteral":
      return evaluate_object_expr(astNode as ObjectLiteral, env);
    case "CallExpr":
      return evalue_call_expr(astNode as CallExpr, env);
    case "AssignmentExpr":
      return evaluate_assigment(astNode as AssignmentExpr, env);
    case "BinaryExpr":
      return evaluate_binary_expr(astNode as BinaryExpr, env);
    case "VarDeclare":
      return evaluate_var_declaration(astNode as VarDeclare, env);

    case "Program":
      return evaluate_program(astNode as Program, env);
    default:
      console.log("THIS AST NODE HAS NOT SETUP", astNode);
      process.exit();
  }
}
