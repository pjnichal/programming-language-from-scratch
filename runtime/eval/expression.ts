import {
  AssignmentExpr,
  BinaryExpr,
  CallExpr,
  Identifier,
  ObjectLiteral,
} from "../../frontend/ast";
import Environment from "../environment";
import { evaluate } from "../interperter";
import {
  FnValue,
  MK_NULL,
  NativeFnValue,
  NumberVal,
  ObjectVal,
  RuntimeVal,
} from "../values";

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
export function evaluate_object_expr(
  obj: ObjectLiteral,
  env: Environment
): RuntimeVal {
  const object = { type: "object", properties: new Map() } as ObjectVal;
  for (const { key, value } of obj.properties) {
    const runtimeVal =
      value == undefined ? env.looupVar(key) : evaluate(value, env);
    object.properties.set(key, runtimeVal);
  }
  return object;
}
export function evalue_call_expr(expr: CallExpr, env: Environment): RuntimeVal {
  const args = expr.arguments.map((arg) => evaluate(arg, env));
  const fn = evaluate(expr.caller, env);
  if (fn.type == "native-fn") {
    const result = (fn as NativeFnValue).call(args, env);
    return result;
  }
  if (fn.type == "function") {
    const func = fn as FnValue;
    const scope = new Environment(func.declareEnv);
    for (let i = 0; i < func.parameters.length; i++) {
      const varname = func.parameters[i];
      scope.declareVar(varname, args[i], false);
    }
    let result: RuntimeVal = MK_NULL();
    for (const stmt of func.body) {
      result = evaluate(stmt, scope);
    }
    return result;
  }
  throw "Cannot call value that is not a function";
}
