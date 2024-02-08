import { ValueType, RuntimeVal, NumberVal, NullVal } from "./values";
import {
  BinaryExpr,
  NodeType,
  NullLiteral,
  NumericLitral,
  Program,
  Stmt,
} from "../frontend/ast";
function evaluate_binary_expr(binop: BinaryExpr): RuntimeVal {
  const lhs = evaluate(binop.left);
  const rhs = evaluate(binop.right);
  if (lhs.type == "number" && rhs.type == "number") {
    return evaluate_numeric_binary_expr(
      lhs as NumberVal,
      rhs as NumberVal,
      binop.operator
    );
  }
  return { type: "null", value: "null" } as NullVal;
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
function evaluate_program(program: Program): RuntimeVal {
  let lastEvalued: RuntimeVal = { type: "null", value: "null" } as NullVal;
  for (const statms of program.body) {
    lastEvalued = evaluate(statms);
  }
  return lastEvalued;
}
export function evaluate(astNode: Stmt): RuntimeVal {
  switch (astNode.kind) {
    case "NumericLitral":
      return {
        value: (astNode as NumericLitral).value,
        type: "number",
      } as NumberVal;
    case "NullLiteral":
      return { value: "null", type: "null" } as NullVal;
    case "BinaryExpr":
      return evaluate_binary_expr(astNode as BinaryExpr);
    case "Program":
      return evaluate_program(astNode as Program);
    default:
      console.log("THIS AST NODE HAS NOT SETUP", astNode);
      process.exit();
  }
}
