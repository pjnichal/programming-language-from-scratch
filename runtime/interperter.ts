import { ValueType, RuntimeVal, NumberVal, NullVal, MK_NULL } from "./values";
import {
  BinaryExpr,
  Identifier,
  NodeType,
  NullLiteral,
  NumericLitral,
  Program,
  Stmt,
} from "../frontend/ast";
import Environment from "./environment";
function evaluate_binary_expr(binop: BinaryExpr, env: Environment): RuntimeVal {
  const lhs = evaluate(binop.left, env);
  const rhs = evaluate(binop.right, env);
  if (lhs.type == "number" && rhs.type == "number") {
    return evaluate_numeric_binary_expr(
      lhs as NumberVal,
      rhs as NumberVal,
      binop.operator
    );
  }
  return MK_NULL();
}
function evaluate_numeric_binary_expr(
  lhs: NumberVal,
  rhs: NumberVal,
  operator: string
): NumberVal {
  let result: number = 0;
  if (operator == "+") {
    result = lhs.value + rhs.value;
  } else if (operator == "-") {
    result = lhs.value - rhs.value;
  } else if (operator == "*") {
    result = lhs.value * rhs.value;
  } else if (operator == "/") {
    result = lhs.value / rhs.value;
  } else if (operator == "%") {
    result = lhs.value % rhs.value;
  }
  return { type: "number", value: result } as NumberVal;
}
function evaluate_program(program: Program, env: Environment): RuntimeVal {
  let lastEvalued: RuntimeVal = MK_NULL();
  for (const statms of program.body) {
    lastEvalued = evaluate(statms, env);
  }
  return lastEvalued;
}
export function evaluate(astNode: Stmt, env: Environment): RuntimeVal {
  switch (astNode.kind) {
    case "NumericLitral":
      return {
        value: (astNode as NumericLitral).value,
        type: "number",
      } as NumberVal;
    case "Identifier":
      return evaluate_ident(astNode as Identifier, env);
    case "NullLiteral":
      return MK_NULL();
    case "BinaryExpr":
      return evaluate_binary_expr(astNode as BinaryExpr, env);
    case "Program":
      return evaluate_program(astNode as Program, env);
    default:
      console.log("THIS AST NODE HAS NOT SETUP", astNode);
      process.exit();
  }
}
function evaluate_ident(ident: Identifier, env: Environment): RuntimeVal {
  const val = env.looupVar(ident.symbol);
  return val;
}
