import fs from "fs";

enum LexerState {
  START,
  NUMBER,
  ID,
  COMMENT,
  STRING,
}

export class Lexer {
  private content: string[];
  private index = 0;
  private peek = "";
  private currentNumber = 0;
  private current = "";
  constructor(filename: string) {
    this.content = ("" + fs.readFileSync(filename)).split("");
    this.consume();
  }
  hasNext() {
    return this.index < this.content.length;
  }
  consumeIf(token: string) {
    if (this.current === token) {
      this.consume();
      return true;
    }
    return false;
  }
  nextIsNumber() {
    return this.current === "";
  }
  consumeNumber() {
    if (!this.nextIsNumber()) throw "Lexer error: Not a number!";
    let result = this.currentNumber;
    this.consume();
    return result;
  }
  consumeId() {
    if (this.nextIsNumber()) throw "Lexer error: Is a number!";
    let result = this.current;
    this.consume();
    return result;
  }
  look() {
    return this.current || this.currentNumber;
  }
  consume() {
    this.current = "";
    this.currentNumber = 0;
    let state = LexerState.START;
    while (this.index < this.content.length) {
      let c = this.peek || this.content[this.index++];
      this.peek = "";
      if (state === LexerState.START) {
        if (("0" <= c && c <= "9") || c === "-") {
          this.current += c;
          state = LexerState.NUMBER;
        } else if (c === "#") {
          state = LexerState.COMMENT;
        } else if (c === ":" || c === ".") {
          this.current += c;
          return;
        } else if (c === '"') {
          this.current += c;
          state = LexerState.STRING;
        } else if (
          ("a" <= c && c <= "z") ||
          ("A" <= c && c <= "Z") ||
          c === "_"
        ) {
          this.current += c;
          state = LexerState.ID;
        }
      } else if (state === LexerState.COMMENT) {
        if (c === "\n" || c === "\r") state = LexerState.START;
      } else if (state === LexerState.NUMBER) {
        if ("0" <= c && c <= "9") {
          this.current += c;
        } else {
          this.currentNumber = +this.current;
          this.current = "";
          this.peek = c;
          return;
        }
      } else if (state === LexerState.ID) {
        if (
          ("a" <= c && c <= "z") ||
          ("A" <= c && c <= "Z") ||
          ("0" <= c && c <= "9") ||
          c === "_"
        ) {
          this.current += c;
        } else {
          this.peek = c;
          return;
        }
      } else if (state === LexerState.STRING) {
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
  }
}
