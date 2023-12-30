import { Component } from '@angular/core';
import * as wasm from '../../../../../pkg';

@Component({
  selector: 'app-basic-calculator',
  templateUrl: './basic-calculator.component.html',
  styleUrls: ['./basic-calculator.component.scss']
})
export class BasicCalculatorComponent {
  title = 'ng-rusty';

  calcFn: 'add' | 'substract' = 'add';

  numA = 26;
  numB = 6;

  answer = 0;

  ngOnInit(): void {
    this.title = wasm.greet('Buddhi');
    this.answer = wasm.calculate_numbers(this.numA, this.numB, this.calcFn);
    console.log(wasm);
  }

  calculateNumbers() {
    this.answer = wasm.calculate_numbers(this.numA, this.numB, this.calcFn);
  }
}
