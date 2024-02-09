import {
  Stmt,
  Program,
  Expr,
  BinaryExpr,
  NumericLitral,
  Identifier,
  VarDeclare,
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
    switch (this.at().type) {
      case TokenType.Let:
      case TokenType.Const:
        return this.parse_var_declare();
      default:
        return this.parse_expr();
    }
  }
  parse_var_declare(): Stmt {
    const isConst = this.eat().type == TokenType.Const;
    const ident = this.expect(
      TokenType.Identifier,
      "Expected varible name"
    ).value;
    if (this.at().type == TokenType.Semicolon) {
      this.eat();
      if (isConst) {
        throw "Must assign value to const";
      }
      return {
        kind: "VarDeclare",
        ident,
        constant: false,
        value: undefined,
      } as VarDeclare;
    }
    this.expect(TokenType.Equals, "Expected equal fot const");
    const declare = {
      kind: "VarDeclare",
      value: this.parse_expr(),
      constant: isConst,
    } as VarDeclare;
    this.expect(TokenType.Semicolon, "Variable declare must end with semicol");
    return declare;
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
