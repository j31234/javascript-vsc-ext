"use strict";

class Sort {
  constructor() {
    const prompt = require('prompt-sync')({
      sigint: true
    });
    const str = prompt();
    this.raw_numbers = str.split(' ').map(x => Number(x));
  }
  print_raw() {
    console.log('before sort', this.raw_numbers);
  }
  print_sorted() {
    console.log('after sort', this.sorted_numbers);
  }
  bubble_sort() {
    let array = this.raw_numbers.concat();
    const len = array.length;
    for (let i = 0; i < len; i++) {
      for (let j = 0; j < len - i - 1; j++) {
        if (array[j] > array[j + 1]) {
          [array[j], array[j + 1]] = [array[j + 1], array[j]];
        }
      }
    }
    this.sorted_numbers = array;
  }
}
let array = new Sort();
array.print_raw();
array.bubble_sort();
array.print_sorted();