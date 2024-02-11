import Parser from "./frontend/parser";
import Environment, { createGlobalEnv } from "./runtime/environment";
import fs from "fs";
const readlineSync = require("readline-sync");
import { evaluate } from "./runtime/interperter";
import { MK_NULL, MK_NUM, MK_BOOL } from "./runtime/values";
run("./test.txt");
function run(filename: string) {
  const parser = new Parser();
  const env = createGlobalEnv();

  const input = fs.readFileSync(filename, "utf-8");
  const program = parser.produceAST(input);
  evaluate(program, env);
}
function repl() {
  const parser = new Parser();
  const env = new Environment();

  console.log("Repl v0.0");

  while (true) {
    const input = readlineSync.question("> ");
    if (!input || input.toLowerCase() == "exit") {
      break;
    }

    const program = parser.produceAST(input);
    evaluate(program, env);

    // Use the input here
  }
}
