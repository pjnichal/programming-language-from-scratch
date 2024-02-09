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
    return this.parse_additive_expr();
  }
  private parse_additive_expr(): Expr {
    let left = this.parse_multiplicative_expr();
    while (this.at().value == "+" || this.at().value == "-") {
      const operator = this.eat().value;
      const right = this.parse_multiplicative_expr();
      left = {
        kind: "BinaryExpr",
        left,
        right,
        operator,
      } as BinaryExpr;
    }
    return left;
  }
  private parse_multiplicative_expr(): Expr {
    let left = this.parse_primary_expr();
    while (
      this.at().value == "*" ||
      this.at().value == "/" ||
      this.at().value == "%"
    ) {
      const operator = this.eat().value;
      const right = this.parse_primary_expr();
      left = {
        kind: "BinaryExpr",
        left,
        right,
        operator,
      } as BinaryExpr;
    }
    return left;
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

      case TokenType.OpenParen:
        this.eat();
        const value = this.parse_expr();
        this.expect(TokenType.CloseParen, "No closing parenthesis");
        return value;
      default:
        console.error("UNHANDLE BLA BLA", this.at());
        process.exit();
    }
  }
  private expect(type: TokenType, error: any) {
    const prev = this.tokens.shift() as Token;
    if (!prev || prev.type != type) {
      console.log("Parser err", error, prev, "Expectiong ", type);
      process.exit();
    }
    return prev;
  }
  private eat(): Token {
    return this.tokens.shift() as Token;
  }
  private at(): Token {
    return this.tokens[0] as Token;
  }
}
