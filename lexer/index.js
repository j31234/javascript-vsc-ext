"use strict";

const { default: antlr4 } = require('antlr4');
const { default: JavaScriptLexer} = require('./JavaScriptLexer.js');

function get_tokens(data) {
  const chars = new antlr4.InputStream(data);
  const lexer = new JavaScriptLexer(chars);
  const tokens = new antlr4.CommonTokenStream(lexer);
  tokens.fill();
  const token_list = tokens.tokens.map(token => ({
    start: token.start,
    channel: token.channel,
    stop: token.stop,
    line: token.line,
    column: token.column,
    text: token.text,
    type: JavaScriptLexer.symbolicNames[token.type]
  }));
  return token_list;
}
module.exports = get_tokens;