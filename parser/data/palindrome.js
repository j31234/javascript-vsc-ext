"use strict";

const prompt = require('prompt-sync')({
  sigint: true
});
const str = prompt();
var len = str.length,
  flag = true;
for (var i = 0; i < Math.floor(len / 2); i++) {
  if (str[i] != str[len - i - 1]) {
    flag = false;
  }
}
console.log(flag);
