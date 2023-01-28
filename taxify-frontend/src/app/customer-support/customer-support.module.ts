import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { CustomerSupportComponent } from './components/customer-support/customer-support.component';
import { AllChatsComponent } from './components/customer-support/all-chats/all-chats.component';
import { ChatComponent } from './components/customer-support/chat/chat.component';
import { CustomerSupportRoutingModule } from './customer-support-routing.module';

@NgModule({
  declarations: [CustomerSupportComponent, AllChatsComponent, ChatComponent],
  imports: [SharedModule, RouterModule, CustomerSupportRoutingModule],
})
export class CustomerSupportModule {}
