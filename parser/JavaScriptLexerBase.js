"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _antlr = _interopRequireDefault(require("antlr4"));
var _JavaScriptLexer = _interopRequireDefault(require("./JavaScriptLexer.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class JavaScriptLexerBase extends _antlr.default.Lexer {
  constructor(input) {
    super(input);
    this.scopeStrictModes = new Array([]);
    this.lastToken = null;
    this.useStrictDefault = false;
    this.useStrictCurrent = false;
    this.templateDepth = 0;
  }
  getStrictDefault() {
    return this.useStrictDefault;
  }
  setUseStrictDefault(value) {
    this.useStrictDefault = value;
    this.useStrictCurrent = value;
  }
  IsStrictMode() {
    return this.useStrictCurrent;
  }
  IsInTemplateString() {
    return this.templateDepth > 0;
  }
  getCurrentToken() {
    return this.nextToken();
  }
  nextToken() {
    var next = super.nextToken();
    if (next.channel === _antlr.default.Token.DEFAULT_CHANNEL) {
      this.lastToken = next;
    }
    return next;
  }
  ProcessOpenBrace() {
    this.useStrictCurrent = this.scopeStrictModes.length > 0 && this.scopeStrictModes[this.scopeStrictModes.length - 1] ? true : this.useStrictDefault;
    this.scopeStrictModes.push(this.useStrictCurrent);
  }
  ProcessCloseBrace() {
    this.useStrictCurrent = this.scopeStrictModes.length > 0 ? this.scopeStrictModes.pop() : this.useStrictDefault;
  }
  ProcessStringLiteral() {
    if (this.lastToken === null || this.lastToken.type === _JavaScriptLexer.default.OpenBrace) {
      if (super.text === '"use strict"' || super.text === "'use strict'") {
        if (this.scopeStrictModes.length > 0) {
          this.scopeStrictModes.pop();
        }
        this.useStrictCurrent = true;
        this.scopeStrictModes.push(this.useStrictCurrent);
      }
    }
  }
  IncreaseTemplateDepth() {
    this.templateDepth++;
  }
  DecreaseTemplateDepth() {
    this.templateDepth--;
  }
  IsStartOfFile() {
    return this.lastToken === null;
  }
}
exports.default = JavaScriptLexerBase;