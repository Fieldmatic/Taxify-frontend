import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { ReportsComponent } from './components/reports/reports.component';
import { ReportsViewComponent } from './components/reports/reports-view/reports-view.component';
import { ReportsRoutingModule } from './reports-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxLineChartsModule } from 'ngx-simple-charts/line';

@NgModule({
  declarations: [ReportsComponent, ReportsViewComponent],
  imports: [
    SharedModule,
    RouterModule,
    MatNativeDateModule,
    ReportsRoutingModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    NgxLineChartsModule,
  ],
})
export class ReportsModule {}
