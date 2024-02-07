import Parser from "./frontend/parser";
const readlineSync = require("readline-sync");
repl();
function repl() {
  const parser = new Parser();
  console.log("Repl v0.0");

  while (true) {
    const input = readlineSync.question("> ");
    if (!input || input.toLowerCase() === "exit") {
      break;
    }

    const program = parser.produceAST(input);

    console.log(program);

    // Use the input here
  }
}
