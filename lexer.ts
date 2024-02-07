const fs = require("fs");
export interface Token {
  type: TokenType;
  value: string;
}
export enum TokenType {
  Number,
  Identifier,
  Equals,
  Let,
  OpenParen,
  CloseParen,
  BinaryOperator,
}
const Keywords: Record<string, TokenType> = {
  let: TokenType.Let,
};
function token(value = "", type: TokenType): Token {
  return { value, type };
}
function isalpha(src: string) {
  return src.toUpperCase() != src.toLowerCase();
}
function isint(str: string) {
  const c = str.charCodeAt(0);
  const bound = ["0".charCodeAt(0), "9".charCodeAt(0)];
  return c >= bound[0] && c <= bound[1];
}
function isskipable(str: string) {
  return str == " " || str == "\n" || str == "\t";
}
export function tokenize(sourceCode: string): Token[] {
  const tokens = new Array<Token>();
  const src = sourceCode.split("");
  while (src.length > 0) {
    if (src[0] == "(") {
      tokens.push(token(src.shift(), TokenType.OpenParen));
    } else if (src[0] == ")") {
      tokens.push(token(src.shift(), TokenType.CloseParen));
    } else if (
      src[0] == "+" ||
      src[0] == "-" ||
      src[0] == "/" ||
      src[0] == "*"
    ) {
      tokens.push(token(src.shift(), TokenType.BinaryOperator));
    } else if (src[0] == "=") {
      tokens.push(token(src.shift(), TokenType.Equals));
    } else {
      if (isint(src[0])) {
        let num = "";
        while (src.length > 0 && isint(src[0])) {
          num += src.shift();
        }
        tokens.push(token(num, TokenType.Number));
      } else if (isalpha(src[0])) {
        let ident = "";
        while (src.length > 0 && isalpha(src[0])) {
          ident += src.shift();
        }
        const resevered = Keywords[ident];
        if (resevered == undefined) {
          tokens.push(token(ident, TokenType.Identifier));
        } else {
          tokens.push(token(ident, resevered));
        }
      } else if (isskipable(src[0])) {
        src.shift();
      } else {
        console.log("Unrecordesize character", src[0]);
        process.exit();
      }
    }
  }

  return tokens;
}
const code = fs.readFileSync("./test.txt", "utf8");
for (const token of tokenize(code)) {
  console.log(token);
}
