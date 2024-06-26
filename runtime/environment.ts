import {
  MK_BOOL,
  MK_NATIVEFN,
  MK_NULL,
  MK_NUM,
  RuntimeVal,
  NumberVal,
  BoolVal,
  ObjectVal,
} from "./values";
export function createGlobalEnv() {
  const env = new Environment();
  env.declareVar("true", MK_BOOL(true), true);
  env.declareVar("false", MK_BOOL(false), true);
  env.declareVar("null", MK_NULL(), true);
  env.declareVar(
    "HelloWorld",
    MK_NATIVEFN((args, env) => {
      args.forEach((val) => {
        switch (val.type) {
          case "number":
            console.log((val as NumberVal).value);
            break;
          case "boolean":
            console.log((val as BoolVal).value);
            break;

          case "object":
            let obj: { [key: string]: any } = {};
            const aObj = val as ObjectVal;
            aObj.properties.forEach((value, key) => { });

            break;
          default:
            console.log("hello");
            break;
        }
      });
      return MK_NULL();
    }),
    true
  );
  env.declareVar(
    "time",
    MK_NATIVEFN((args, env) => {
      return MK_NUM(Date.now());
    }),
    true
  );
  return env;
}
export default class Environment {
  private parent?: Environment;
  private variables: Map<string, RuntimeVal>;
  private constants: Set<string>;
  constructor(parentENV?: Environment) {
    this.parent = parentENV;
    this.variables = new Map();
    this.constants = new Set();
  }

  public declareVar(
    varname: string,
    value: RuntimeVal,
    constant: boolean
  ): RuntimeVal {
    if (this.variables.has(varname)) {
      throw "Cannot decalre varibale " + varname + "as it alread defined";
    }
    this.variables.set(varname, value);
    if (constant) {
      this.constants.add(varname);
    }
    return value;
  }
  public assignVar(varname: string, value: RuntimeVal): RuntimeVal {
    const env = this.resolve(varname);
    if (env.constants.has(varname)) {
      throw `Cannot reassign variable ${varname} already defined`;
    }
    env.variables.set(varname, value);
    return value;
  }
  public resolve(varname: string): Environment {
    if (this.variables.has(varname)) {
      return this;
    }
    if (this.parent == undefined) {
      throw `cannot resolve ${varname} as it doesnot exits`;
    }
    return this.parent.resolve(varname);
  }
  public lookUpVar(varname: string): RuntimeVal {
    const env = this.resolve(varname);
    return env.variables.get(varname) as RuntimeVal;
  }
}
