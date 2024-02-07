import {
  Stmt,
  Program,
  Expr,
  BinaryExpr,
  NumericLitral,
  Identifier,
} from "./ast";
import { tokenize, TokenType, Token } from "./lexer";
export default class Parser {
  private tokens: Token[] = [];

  public produceAST(sourceCode: string): Program {
    this.tokens = tokenize(sourceCode);
    const program: Program = { kind: "Program", body: [] };

    while (this.not_eof()) {
      program.body.push(this.parse_stmt());
    }

    return program;
  }
  private not_eof(): boolean {
    return this.tokens[0].type != TokenType.EOF;
  }
  private parse_stmt(): Stmt {
    return this.parse_expr();
  }
  private parse_expr(): Expr {
    return this.parse_primary_expr();
  }
  private parse_primary_expr(): Expr {
    const token = this.at().type;

    switch (token) {
      case TokenType.Identifier:
        return { kind: "Identifier", symbol: this.eat().value } as Identifier;
      case TokenType.Number:
        return {
          kind: "NumericLitral",
          value: parseFloat(this.eat().value),
        } as NumericLitral;
      default:
        console.error("UNHANDLE BLA BLA");
        process.exit();
    }
  }
  private eat(): Token {
    return this.tokens.shift() as Token;
  }
  private at(): Token {
    return this.tokens[0] as Token;
  }
}
