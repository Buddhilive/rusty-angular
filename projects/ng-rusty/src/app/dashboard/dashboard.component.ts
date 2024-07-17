import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  template: `<div class="flex flex-row flex-wrap gap-4">
  <p-card [header]="tool.name" class="flex-initial" *ngFor="let tool of tools">
    <ng-template pTemplate="footer">
        <p-button label="Open" icon="pi pi-chevron-right" [routerLink]="tool.path"></p-button>
    </ng-template>
  </p-card>
</div>
`,
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
    },
    {
      name: 'IndexedDB',
      path: 'db'
    }
  ];
}
