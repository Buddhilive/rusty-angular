import { Component } from '@angular/core';
import * as wasm from '../../../../../pkg';

@Component({
  selector: 'app-basic-calculator',
  templateUrl: './basic-calculator.component.html',
  styleUrls: ['./basic-calculator.component.scss']
})
export class BasicCalculatorComponent {
  calcFn = 'add';
  calculations = [
    { name: 'Addition', value: 'add' },
    { name: 'Substraction', value: 'substract' },
    { name: 'Division', value: 'divide' },
    { name: 'Multiplication', value: 'multiply' }
  ];

  numA = 26;
  numB = 6;

  answer = 0;

  ngOnInit(): void {
    const test = wasm.vector_me(new Int32Array([1, 2, 3]));
    console.log(test);
  }

  calculateNumbers() {
    this.answer = wasm.calculate_numbers(this.numA, this.numB, this.calcFn);
  }
}
