import { Component } from '@angular/core';
import * as wasm from '../../../../../pkg';

@Component({
  selector: 'app-basic-calculator',
  template: `<div class="formgrid grid">
  <div class="field col">
    <p-inputNumber inputId="integeronly" [(ngModel)]="numA"></p-inputNumber>
  </div>
  <div class="field col">
    <p-inputNumber inputId="integeronly" [(ngModel)]="numB"></p-inputNumber>
  </div>
  <div class="field col">
    <p-dropdown
      [options]="calculations"
      [(ngModel)]="calcFn"
      optionLabel="name"
      optionValue="value"
    ></p-dropdown>
  </div>
  <div class="field col">
    <p-button (click)="calculateNumbers()" [label]="calcFn.toUpperCase()"></p-button>
  </div>
  <div class="field col">
    <p>Answer is {{ answer }}</p>
  </div>
</div>`,
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
