import { Component, OnInit } from '@angular/core';
import * as wasm from '../../../../pkg';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ng-rusty';

  calcFn: 'add' | 'substract' = 'add';

  numA = 5;
  numB = 26;

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
