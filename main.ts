import Parser from "./frontend/parser";
import Environment from "./runtime/environment";
const readlineSync = require("readline-sync");
import { evaluate } from "./runtime/interperter";
import { NumberVal } from "./runtime/values";
repl();
function repl() {
  const parser = new Parser();
  const env = new Environment();
  env.declareVar("x", { value: 100, type: "number" } as NumberVal);
  console.log("Repl v0.0");

  while (true) {
    const input = readlineSync.question("> ");
    if (!input || input.toLowerCase() == "exit") {
      break;
    }

    const program = parser.produceAST(input);
    const result = evaluate(program, env);
    console.log(result);

    // Use the input here
  }
}
