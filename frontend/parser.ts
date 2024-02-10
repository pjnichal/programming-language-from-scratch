import {
  Stmt,
  Program,
  Expr,
  BinaryExpr,
  NumericLitral,
  Identifier,
  VarDeclare,
  AssignmentExpr,
  Property,
  ObjectLiteral,
  CallExpr,
  MemberExpr,
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
      ident,
      kind: "VarDeclare",
      value: this.parse_expr(),
      constant: isConst,
    } as VarDeclare;
    this.expect(TokenType.Semicolon, "Variable declare must end with semicol");
    return declare;
  }
  private parse_expr(): Expr {
    return this.parse_assignment_expr();
  }
  private parse_assignment_expr(): Expr {
    const left = this.parse_object_expr();
    if (this.at().type == TokenType.Equals) {
      this.eat();
      const value = this.parse_assignment_expr();
      return { value, assigne: left, kind: "AssignmentExpr" } as AssignmentExpr;
    }
    return left;
  }
  private parse_object_expr(): Expr {
    if (this.at().type !== TokenType.OpenBrace) {
      return this.parse_additive_expr();
    }
    this.eat();
    const properties = new Array<Property>();
    while (this.not_eof() && this.at().type != TokenType.CloseBrace) {
      const key = this.expect(
        TokenType.Identifier,
        "Object literal key expected"
      ).value;
      if (this.at().type == TokenType.Comma) {
        this.eat();
        properties.push({ key, kind: "Property" } as Property);
        continue;
      } else if (this.at().type == TokenType.CloseBrace) {
        properties.push({ key, kind: "Property" } as Property);
        continue;
      }

      this.expect(
        TokenType.Colon,
        "Missing clon folwing identifer in object expr"
      );
      const value = this.parse_expr();
      properties.push({ kind: "Property", value, key });
      if (this.at().type != TokenType.CloseBrace) {
        this.expect(TokenType.Comma, "Expected comma");
      }
    }
    this.expect(TokenType.CloseBrace, "Object literal missing clsoe brace");
    return { kind: "ObjectLiteral", properties } as ObjectLiteral;
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
    let left = this.parse_call_memeber_expr();
    while (
      this.at().value == "*" ||
      this.at().value == "/" ||
      this.at().value == "%"
    ) {
      const operator = this.eat().value;
      const right = this.parse_call_memeber_expr();
      left = {
        kind: "BinaryExpr",
        left,
        right,
        operator,
      } as BinaryExpr;
    }
    return left;
  }
  private parse_call_memeber_expr(): Expr {
    const memeber = this.parse_member_expr();
    if (this.at().type == TokenType.OpenParen) {
      return this.parse_call_expr(memeber);
    }
    return memeber;
  }
  private parse_call_expr(caller: Expr): Expr {
    let call_expr: Expr = {
      kind: "CallExpr",
      arguments: this.parse_args(),
      caller,
    } as CallExpr;
    if (this.at().type == TokenType.OpenParen) {
      call_expr = this.parse_call_expr(call_expr);
    }
    return call_expr;
  }
  private parse_args(): Expr[] {
    this.expect(TokenType.OpenParen, "Expected Open paraenteisi");
    const args =
      this.at().type == TokenType.CloseParen ? [] : this.parse_argument_list();
    this.expect(TokenType.CloseParen, "Missing closing parentheisis");
    return args;
  }
  private parse_argument_list(): Expr[] {
    const args = [this.parse_assignment_expr()];
    while (this.at().type == TokenType.Comma && this.eat()) {
      args.push(this.parse_assignment_expr());
    }
    return args;
  }
  private parse_member_expr(): Expr {
    let object = this.parse_primary_expr();
    while (
      this.at().type == TokenType.Dot ||
      this.at().type == TokenType.OpenBracket
    ) {
      let operator = this.eat();
      let property: Expr;
      let computed: boolean;
      if (operator.type == TokenType.Dot) {
        computed = false;
        property = this.parse_primary_expr();
        if (property.kind != "Identifier") {
          throw "Cannot use dit operator without right hand side being a identifier";
        }
      } else {
        computed = true;
        property = this.parse_expr();
        this.expect(TokenType.CloseBracket, "Missing closing bracker");
      }
      object = { kind: "MemberExpr", object, property, computed } as MemberExpr;
    }
    return object;
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
