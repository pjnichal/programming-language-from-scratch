import { Program, VarDeclare } from "../../frontend/ast";
import Environment from "../environment";
import { evaluate } from "../interperter";
import { MK_NULL, RuntimeVal } from "../values";

export function evaluate_program(
  program: Program,
  env: Environment
): RuntimeVal {
  let lastEvalued: RuntimeVal = MK_NULL();
  for (const statms of program.body) {
    lastEvalued = evaluate(statms, env);
  }
  return lastEvalued;
}
export function evaluate_var_declaration(
  varDeclare: VarDeclare,
  env: Environment
): RuntimeVal {
  const value = varDeclare.value ? evaluate(varDeclare.value, env) : MK_NULL();

  return env.declareVar(varDeclare.ident, value, varDeclare.constant);
}
