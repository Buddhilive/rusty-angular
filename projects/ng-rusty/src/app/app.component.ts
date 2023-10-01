import { Component, OnInit } from '@angular/core';
import * as wasm from '../../../../pkg';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ng-rusty';

  ngOnInit(): void {
    this.title = wasm.greet('Buddhi');
    console.log(wasm, wasm.add_numbers(8,2));
  }
}
