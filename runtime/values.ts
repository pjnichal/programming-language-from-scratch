import Envirement from "./environment";
export type ValueType = "null" | "number" | "boolean" | "object" | "native-fn";
export interface RuntimeVal {
  type: ValueType;
}
export interface NullVal extends RuntimeVal {
  type: "null";
  value: null;
}
export interface NumberVal extends RuntimeVal {
  type: "number";
  value: number;
}
export interface ObjectVal extends RuntimeVal {
  type: "object";
  properties: Map<String, RuntimeVal>;
}
export interface BoolVal extends RuntimeVal {
  type: "boolean";
  value: boolean;
}
export interface NativeFnValue extends RuntimeVal {
  type: "native-fn";
  call: FunctionCall;
}
export type FunctionCall = (args: RuntimeVal[], env: Envirement) => RuntimeVal;
export function MK_NULL() {
  return { type: "null", value: null } as NullVal;
}
export function MK_NUM(n = 0) {
  return { type: "number", value: n } as NumberVal;
}
export function MK_BOOL(b = true) {
  return { type: "boolean", value: b } as BoolVal;
}
export function MK_NATIVEFN(call: FunctionCall) {
  return { type: "native-fn", call } as NativeFnValue;
}
