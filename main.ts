import Parser from "./frontend/parser";
const readlineSync = require("readline-sync");
import { evaluate } from "./runtime/interperter";
repl();
function repl() {
  const parser = new Parser();
  console.log("Repl v0.0");

  while (true) {
    const input = readlineSync.question("> ");
    if (!input || input.toLowerCase() == "exit") {
      break;
    }

    const program = parser.produceAST(input);
    const result = evaluate(program);
    console.log(JSON.stringify(program, null, 1));

    // Use the input here
  }
}
