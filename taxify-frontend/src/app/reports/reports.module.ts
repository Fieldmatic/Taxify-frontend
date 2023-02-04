import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { ReportsComponent } from './components/reports/reports.component';
import { ReportsViewComponent } from './components/reports/reports-view/reports-view.component';
import { ReportsRoutingModule } from './reports-routing.module';

@NgModule({
  declarations: [ReportsComponent, ReportsViewComponent],
  imports: [SharedModule, RouterModule, ReportsRoutingModule],
})
export class ReportsModule {}
