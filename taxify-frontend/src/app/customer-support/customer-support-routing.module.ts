import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerSupportComponent } from './components/customer-support/customer-support.component';
import { AuthGuard } from '../auth/auth.guard';
import { AllChatsComponent } from './components/customer-support/all-chats/all-chats.component';
import { ChatComponent } from './components/customer-support/chat/chat.component';
import { ChatsResolverService} from './services/chats-resolver-service'

const routes: Routes = [
  {
    path: 'customerSupport',
    component: CustomerSupportComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'chats',
        resolve: [ChatsResolverService],
        component: AllChatsComponent,
      },
      {
        path: 'chat/:id',
        pathMatch: 'full',
        component: ChatComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerSupportRoutingModule {}
