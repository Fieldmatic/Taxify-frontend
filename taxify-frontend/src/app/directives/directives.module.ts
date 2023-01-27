import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HasRoleDirective } from './hasRole/hasRole.directive';

@NgModule({
  declarations: [HasRoleDirective],
  imports: [CommonModule],
  exports: [HasRoleDirective],
})
export class DirectivesModule {}
