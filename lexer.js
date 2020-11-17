"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lexer = void 0;
var fs_1 = __importDefault(require("fs"));
var LexerState;
(function (LexerState) {
    LexerState[LexerState["START"] = 0] = "START";
    LexerState[LexerState["NUMBER"] = 1] = "NUMBER";
    LexerState[LexerState["ID"] = 2] = "ID";
    LexerState[LexerState["COMMENT"] = 3] = "COMMENT";
    LexerState[LexerState["STRING"] = 4] = "STRING";
})(LexerState || (LexerState = {}));
var Lexer = /** @class */ (function () {
    function Lexer(filename) {
        this.index = 0;
        this.peek = "";
        this.currentNumber = 0;
        this.current = "";
        this.lineNumber = 1;
        this.content = ("" + fs_1.default.readFileSync(filename)).split("");
        this.consume();
    }
    Lexer.prototype.hasNext = function () {
        return this.index < this.content.length;
    };
    Lexer.prototype.consumeIf = function (token) {
        if (this.current === token) {
            this.consume();
            return true;
        }
        return false;
    };
    Lexer.prototype.nextIsNumber = function () {
        return this.current === "";
    };
    Lexer.prototype.consumeNumber = function () {
        if (!this.nextIsNumber())
            throw "Lexer error: Not a number!";
        var result = this.currentNumber;
        this.consume();
        return result;
    };
    Lexer.prototype.consumeId = function () {
        if (this.nextIsNumber())
            throw "Lexer error: Is a number!";
        var result = this.current;
        this.consume();
        return result;
    };
    Lexer.prototype.look = function () {
        return this.current || this.currentNumber;
    };
    Lexer.prototype.getLineNumber = function () {
        return this.lineNumber;
    };
    Lexer.prototype.consume = function () {
        this.current = "";
        this.currentNumber = 0;
        var state = LexerState.START;
        while (this.index < this.content.length) {
            if (!this.peek && this.content[this.index] === "\n") {
                this.lineNumber++;
            }
            var c = this.peek || this.content[this.index++];
            this.peek = "";
            if (state === LexerState.START) {
                if (("0" <= c && c <= "9") || c === "-") {
                    this.current += c;
                    state = LexerState.NUMBER;
                }
                else if (c === "#") {
                    state = LexerState.COMMENT;
                }
                else if (c === ":" || c === ".") {
                    this.current += c;
                    return;
                }
                else if (c === '"') {
                    this.current += c;
                    state = LexerState.STRING;
                }
                else if (("a" <= c && c <= "z") ||
                    ("A" <= c && c <= "Z") ||
                    c === "_") {
                    this.current += c;
                    state = LexerState.ID;
                }
            }
            else if (state === LexerState.COMMENT) {
                if (c === "\n" || c === "\r")
                    state = LexerState.START;
            }
            else if (state === LexerState.NUMBER) {
                if ("0" <= c && c <= "9") {
                    this.current += c;
                }
                else {
                    this.currentNumber = +this.current;
                    this.current = "";
                    this.peek = c;
                    return;
                }
            }
            else if (state === LexerState.ID) {
                if (("a" <= c && c <= "z") ||
                    ("A" <= c && c <= "Z") ||
                    ("0" <= c && c <= "9") ||
                    c === "_") {
                    this.current += c;
                }
                else {
                    this.peek = c;
                    return;
                }
            }
            else if (state === LexerState.STRING) {
                this.current += c;
                if (c === '"') {
                    return;
                }
            }
        }
        if (state === LexerState.NUMBER) {
            this.currentNumber = +this.current;
            this.current = "";
            return;
        }
    };
    return Lexer;
}());
exports.Lexer = Lexer;
