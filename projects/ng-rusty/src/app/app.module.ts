import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';

import { BasicCalculatorComponent } from './basic-calculator/basic-calculator.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BmiCalculatorComponent } from './bmi-calculator/bmi-calculator.component';
import { IndexdbComponent } from './indexdb/indexdb.component';

@NgModule({
  declarations: [
    AppComponent,
    BasicCalculatorComponent,
    DashboardComponent,
    BmiCalculatorComponent,
    IndexdbComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NoopAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    InputNumberModule,
    DropdownModule,
    TagModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
