import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BasicCalculatorComponent } from './basic-calculator/basic-calculator.component';
import { BmiCalculatorComponent } from './bmi-calculator/bmi-calculator.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent
  },
  {
    path: 'basic-calculator',
    component: BasicCalculatorComponent
  },
  {
    path: 'bmi',
    component: BmiCalculatorComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
