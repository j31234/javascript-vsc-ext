"use strict";

var _antlr = _interopRequireDefault(require("antlr4"));
var _JavaScriptLexer = _interopRequireDefault(require("./JavaScriptLexer.js"));
var _JavaScriptParser = _interopRequireDefault(require("./JavaScriptParser.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function get_AST(data)
{
  const chars = new _antlr.default.InputStream(data);
  const lexer = new _JavaScriptLexer.default(chars);
  const tokens = new _antlr.default.CommonTokenStream(lexer);
  const parser = new _JavaScriptParser.default(tokens);
  tokens.fill();
  parser.buildParseTrees = true;

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
  return result;
}

module.exports = get_AST;