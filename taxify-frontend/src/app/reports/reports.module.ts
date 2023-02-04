import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { ReportsComponent } from './components/reports/reports.component';
import { ReportsViewComponent } from './components/reports/reports-view/reports-view.component';

@NgModule({
  declarations: [ReportsComponent, ReportsViewComponent],
  imports: [SharedModule, RouterModule],
})
export class ReportsModule {}
