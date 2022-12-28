"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _antlr = _interopRequireDefault(require("antlr4"));
var _JavaScriptParser = _interopRequireDefault(require("./JavaScriptParser.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class JavaScriptParserBase extends _antlr.default.Parser {
  constructor(input) {
    super(input);
  }
  p(str) {
    return this.prev(str);
  }
  prev(str) {
    return this._input.LT(-1).text === str;
  }

  // Short form for next(String str)
  n(str) {
    return this.next(str);
  }

  // Whether the next token value equals to @param str
  next(str) {
    return this._input.LT(1).text === str;
  }
  notLineTerminator() {
    return !this.here(_JavaScriptParser.default.LineTerminator);
  }
  notOpenBraceAndNotFunction() {
    const nextTokenType = this._input.LT(1).type;
    return nextTokenType !== _JavaScriptParser.default.OpenBrace && nextTokenType !== _JavaScriptParser.default.Function_;
  }
  closeBrace() {
    return this._input.LT(1).type === _JavaScriptParser.default.CloseBrace;
  }
  here(type) {
    const possibleIndexEosToken = this.getCurrentToken().tokenIndex - 1;
    const ahead = this._input.get(possibleIndexEosToken);
    return ahead.channel === _antlr.default.Lexer.HIDDEN && ahead.type === type;
  }
  lineTerminatorAhead() {
    let possibleIndexEosToken = this.getCurrentToken().tokenIndex - 1;
    let ahead = this._input.get(possibleIndexEosToken);
    if (ahead.channel !== _antlr.default.Lexer.HIDDEN) {
      return false;
    }
    if (ahead.type === _JavaScriptParser.default.LineTerminator) {
      return true;
    }
    if (ahead.type === _JavaScriptParser.default.WhiteSpaces) {
      possibleIndexEosToken = this.getCurrentToken().tokenIndex - 2;
      ahead = this._input.get(possibleIndexEosToken);
    }
    const text = ahead.text;
    const type = ahead.type;
    return type === _JavaScriptParser.default.MultiLineComment && (text.includes("\r") || text.includes("\n")) || type === _JavaScriptParser.default.LineTerminator;
  }
}
exports.default = JavaScriptParserBase;