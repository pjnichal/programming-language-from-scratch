import { AssignmentExpr, BinaryExpr, Identifier } from "../../frontend/ast";
import Environment from "../environment";
import { evaluate } from "../interperter";
import { MK_NULL, NumberVal, RuntimeVal } from "../values";

export function evaluate_binary_expr(
  binop: BinaryExpr,
  env: Environment
): RuntimeVal {
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
export function evaluate_ident(
  ident: Identifier,
  env: Environment
): RuntimeVal {
  const val = env.looupVar(ident.symbol);
  return val;
}
export function evaluate_assigment(
  node: AssignmentExpr,
  env: Environment
): RuntimeVal {
  if (node.assigne.kind != "Identifier") {
    throw "Invalid LHS inside assignment expr" + JSON.stringify(node.assigne);
  }
  const varname = (node.assigne as Identifier).symbol;
  return env.assignVar(varname, evaluate(node.value, env));
}
