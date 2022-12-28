"use strict";

var _fs = _interopRequireDefault(require("fs"));
var _antlr = _interopRequireDefault(require("antlr4"));
var _JavaScriptLexer = _interopRequireDefault(require("./JavaScriptLexer.js"));
var _JavaScriptParser = _interopRequireDefault(require("./JavaScriptParser.js"));
var _JavaScriptParserListener = _interopRequireDefault(require("./JavaScriptParserListener.js"));
var _JavaScriptParserVisitor = _interopRequireDefault(require("./JavaScriptParserVisitor.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// const data = fs.readFileSync('./JavaScriptLexerBase.js', 'utf8');
const data = _fs.default.readFileSync(0, 'utf8'); // read from stdin
const chars = new _antlr.default.InputStream(data);
const lexer = new _JavaScriptLexer.default(chars);
const tokens = new _antlr.default.CommonTokenStream(lexer);
const parser = new _JavaScriptParser.default(tokens);
tokens.fill();
parser.buildParseTrees = true;
_fs.default.writeFileSync('./LexerResult.tokens', tokens.tokens.map(t => t.toString()).join(' '), 'utf8');
// fs.writeFileSync('./LexerResult.tree', antlr4.tree.Trees.toStringTree(parser.program(), 'JavaScript', parser), 'utf8');

var ruleNames = parser.ruleNames;
var tree = parser.program();
class Visitor {
  visitChildren(ctx) {
    let ret = {};
    if (!ctx) {
      return;
    }
    ret['type'] = ruleNames[ctx.ruleIndex];
    if (ctx.children) {
      ret['body'] = [];
      ctx.children.forEach(child => {
        if (child.children && child.children.length != 0) {
          ret['body'].push(child.accept(this));
        } else {
          ret['body'].push(child.getText());
        }
      });
    }
    return ret;
  }
}
var result = tree.accept(new Visitor());
console.log(JSON.stringify(result, null, 2));