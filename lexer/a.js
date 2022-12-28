"use strict";

const get_tokens = require('./index.js');
const data = 'var x = 1;';
const tokens = get_tokens(data);
console.log(tokens);