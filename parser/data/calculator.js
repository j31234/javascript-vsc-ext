"use strict";

const calculator = str => {
  let operator = [],
    result = [],
    nowIndex = 0;
  const weight = {
    '+': 1,
    '-': 1,
    '*': 2,
    '/': 2,
    '(': 3,
    ')': 3
  };
  const operatorArray = ['+', '-', '*', '/'];
  while (str[nowIndex]) {
    if (str[nowIndex]) {
      if (!isNaN(str[nowIndex])) {
        result.push(str[nowIndex]);
      } else if (str[nowIndex] === '(' || str[nowIndex] === ')') {
        if (str[nowIndex] === '(') {
          operator.push(str[nowIndex]);
        } else {
          result.push(operator.pop());
          while (operator[operator.length - 1] !== '(') {
            result.push(operator.pop());
          }
          operator.pop();
        }
      } else if (operatorArray.indexOf(str[nowIndex]) !== -1) {
        let nowTop = operator[operator.length - 1];
        while (weight[str[nowIndex]] <= weight[nowTop] && nowTop !== '(') {
          result.push(operator.pop());
          nowTop = operator[operator.length - 1];
        }
        operator.push(str[nowIndex]);
      }
    }
    nowIndex++;
  }
  while (operator.length) {
    result.push(operator.pop());
  }
  return result.join('');
};
const getResult = str => {
  console.log('Reverse Polish notation:', str);
  let arr = str.split('');
  let resultArr = []; //当前结果
  arr.forEach((item, index) => {
    if (!isNaN(item)) {
      // 数字
      resultArr.push(+item);
    } else {
      // 字符
      let firstFloor = resultArr.pop();
      let secondFloor = resultArr.pop();
      switch (item) {
        case '+':
          resultArr.push(secondFloor + firstFloor);
          break;
        case '-':
          resultArr.push(secondFloor - firstFloor);
          break;
        case '*':
          resultArr.push(secondFloor * firstFloor);
          break;
        case '/':
          resultArr.push(secondFloor / firstFloor);
          break;
      }
    }
  });
  console.log(resultArr.pop());
};
const prompt = require('prompt-sync')({
  sigint: true
});
let str = prompt();
RPN = calculator(str);
getResult(RPN);