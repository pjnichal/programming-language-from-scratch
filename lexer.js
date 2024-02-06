"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenize = exports.TokenType = void 0;
var TokenType;
(function (TokenType) {
    TokenType[TokenType["Number"] = 0] = "Number";
    TokenType[TokenType["Identifier"] = 1] = "Identifier";
    TokenType[TokenType["Equals"] = 2] = "Equals";
    TokenType[TokenType["Let"] = 3] = "Let";
    TokenType[TokenType["OpenParen"] = 4] = "OpenParen";
    TokenType[TokenType["CloseParen"] = 5] = "CloseParen";
    TokenType[TokenType["BinaryOperator"] = 6] = "BinaryOperator";
})(TokenType || (exports.TokenType = TokenType = {}));
var Keywords = {
    let: TokenType.Let,
};
function token(value, type) {
    if (value === void 0) { value = ""; }
    return { value: value, type: type };
}
function isalpha(src) {
    return src.toUpperCase() != src.toLowerCase();
}
function isint(str) {
    var c = str.charCodeAt(0);
    var bound = ["0".charCodeAt(0), "9".charCodeAt(0)];
    return c >= bound[0] && c <= bound[1];
}
function isskipable(str) {
    return str == " " || str == "\n" || str == "\t";
}
function tokenize(sourceCode) {
    var tokens = new Array();
    var src = sourceCode.split("");
    while (src.length > 0) {
        if (src[0] == "(") {
            tokens.push(token(src.shift(), TokenType.OpenParen));
        }
        else if (src[0] == ")") {
            tokens.push(token(src.shift(), TokenType.CloseParen));
        }
        else if (src[0] == "+" ||
            src[0] == "-" ||
            src[0] == "/" ||
            src[0] == "*") {
            tokens.push(token(src.shift(), TokenType.BinaryOperator));
        }
        else if (src[0] == "=") {
            tokens.push(token(src.shift(), TokenType.Equals));
        }
        else {
            if (isint(src[0])) {
                var num = "";
                while (src.length > 0 && isint(src[0])) {
                    num += src.shift();
                }
                tokens.push(token(num, TokenType.Number));
            }
            else if (isalpha(src[0])) {
                var ident = "";
                while (src.length > 0 && isalpha(src[0])) {
                    ident += src.shift();
                }
                var resevered = Keywords[ident];
                if (resevered == undefined) {
                    tokens.push(token(ident, TokenType.Identifier));
                }
                else {
                    tokens.push(token(ident, resevered));
                }
            }
            else if (isskipable(src[0])) {
                src.shift();
            }
            else {
                console.log("Unrecordesize character", src[0]);
                process.exit();
            }
        }
    }
    return tokens;
}
exports.tokenize = tokenize;
console.log(tokenize("+-*/()letwhile"));
