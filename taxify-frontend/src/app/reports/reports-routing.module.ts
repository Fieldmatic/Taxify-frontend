import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ReportsComponent } from './components/reports/reports.component';
import { AuthGuard } from '../auth/auth.guard';

const routes: Routes = [
  {
    path: 'reports',
    component: ReportsComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}
