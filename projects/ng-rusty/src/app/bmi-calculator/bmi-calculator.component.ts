import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import * as wasm from '../../../../../pkg';

@Component({
  selector: 'app-bmi-calculator',
  template: `<form [formGroup]="bmiForm" (ngSubmit)="onSubmit()">
  <div class="formgrid grid">
    <div class="field col">
      <p-inputNumber
        inputId="integeronly"
        formControlName="height"
        suffix=" cm"
      ></p-inputNumber>
    </div>
    <div class="field col">
      <p-inputNumber
        inputId="integeronly"
        formControlName="weight"
        suffix=" kg"
      ></p-inputNumber>
    </div>
  </div>
  <div class="flex gap-4">
    <p-button
      type="submit"
      label="Calculate"
      [disabled]="bmiForm.invalid"
    ></p-button>

    <p-tag [severity]="tagColor" [value]="bmi"></p-tag>
  </div>
</form>`,
  styleUrls: ['./bmi-calculator.component.scss']
})
export class BmiCalculatorComponent {

  bmiForm: FormGroup = new FormGroup({
    height: new FormControl(''),
    weight: new FormControl(''),
  });

  bmi = '0';
  tagColor = 'info';

  onSubmit(): void {
    const bmiValue = wasm.calculate_bmi(this.bmiForm.value.height, this.bmiForm.value.weight);

    if (bmiValue < 18.5) {
      this.bmi = `Underweight (${bmiValue.toFixed(2)})`;
      this.tagColor = 'warning';
    } else if (bmiValue > 18.5 && bmiValue < 24.9) {
      this.bmi = `Healthy Weight (${bmiValue.toFixed(2)})`;
      this.tagColor = 'success';
    } else if (bmiValue > 24.9 && bmiValue < 29.9) {
      this.bmi = `Overweight (${bmiValue.toFixed(2)})`;
      this.tagColor = 'warning';
    } else if (bmiValue > 29.9) {
      this.bmi = `Obasity (${bmiValue.toFixed(2)})`;
      this.tagColor = 'danger';
    }
  }
}
