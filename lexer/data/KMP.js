"use strict";

const prompt = require('prompt-sync')({
  sigint: true
});
function prepare() {
  let i,
    j = 0;
  P[1] = 0;
  for (i = 2; i <= m; ++i) {
    while (j && B[j + 1] !== B[i]) j = P[j];
    if (B[j + 1] === B[i]) ++j;
    P[i] = j;
  }
}
function KMP() {
  let i,
    j = 0;
  for (i = 1; i <= n; ++i) {
    while (j && B[j + 1] != A[i]) j = P[j];
    if (B[j + 1] === A[i]) ++j;
    if (j === m) {
      bo = 1;
      console.log(i - m);
      j = P[j];
    }
  }
}
var A = ' '.concat(prompt('string:'));
var B = ' '.concat(prompt('pattern:'));
var P = new Array(B.length).fill(0);
var n = A.length - 1,
  m = B.length - 1;
prepare();
KMP();