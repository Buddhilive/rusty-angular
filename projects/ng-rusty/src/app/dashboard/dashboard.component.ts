import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  tools = [
    {
      name: 'Basic Calculator',
      path: 'basic-calculator'
    },
    {
      name: 'BMI Calculator',
      path: 'bmi'
    }
  ];
}
