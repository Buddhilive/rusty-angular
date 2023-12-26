import { Component, OnInit } from '@angular/core';
import * as wasm from '../../../../pkg';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ng-rusty';

  numA = 5;
  numB = 26;

  answer = 0;

  ngOnInit(): void {
    this.title = wasm.greet('Buddhi');
    this.answer = wasm.add_numbers(this.numA, this.numB);
    console.log(wasm);
  }

  addNumbers() {
    this.answer = wasm.add_numbers(this.numA, this.numB);
  }
}
