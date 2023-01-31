import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { anyInputValidator } from '../../../../../shared/validators/any-input-filled.validator';
import { Store } from '@ngrx/store';
import * as fromApp from '../../../../../store/app.reducer';
import * as CustomerSupportActions from '../../../../store/customer-support.actions';
import { User } from 'src/app/shared/model/user.model';

@Component({
  selector: 'app-message-input',
  templateUrl: './message-input.component.html',
  styleUrls: ['./message-input.component.scss'],
})
export class MessageInputComponent implements OnInit {
  @Input() interlocutor: User | null;
  messageForm: FormGroup;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit(): void {
    this.messageForm = new FormGroup(
      {
        message: new FormControl(''),
      },
      {
        validators: anyInputValidator(),
      }
    );
  }

  sendMessage() {
    this.store.dispatch(
      new CustomerSupportActions.SendMessage({
        content: this.messageForm.controls['message'].value,
        receiverEmail: this.interlocutor ? this.interlocutor.email : null,
      })
    );
    this.messageForm.controls['message'].setValue('');
  }
}
