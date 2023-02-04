import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { CustomerSupportComponent } from './components/customer-support/customer-support.component';
import { AllChatsComponent } from './components/customer-support/all-chats/all-chats.component';
import { ChatComponent } from './components/customer-support/chat/chat.component';
import { CustomerSupportRoutingModule } from './customer-support-routing.module';
import { NoChatsComponent } from './components/customer-support/all-chats/no-chats/no-chats.component';
import { ChatPreviewComponent } from './components/customer-support/all-chats/chat-preview/chat-preview.component';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { ReactiveFormsModule } from '@angular/forms';
import { MessageComponent } from './components/customer-support/chat/message/message.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MessageInputComponent } from './components/customer-support/chat/message-input/message-input.component';

@NgModule({
  declarations: [
    CustomerSupportComponent,
    AllChatsComponent,
    ChatComponent,
    NoChatsComponent,
    ChatPreviewComponent,
    MessageInputComponent,
    MessageComponent,
  ],
  imports: [
    SharedModule,
    RouterModule,
    CustomerSupportRoutingModule,
    MaterialFileInputModule,
    ReactiveFormsModule,
    ScrollingModule,
  ],
})
export class CustomerSupportModule {}
