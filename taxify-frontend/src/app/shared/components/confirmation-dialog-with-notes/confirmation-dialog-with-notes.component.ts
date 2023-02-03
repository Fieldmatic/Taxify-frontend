import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import * as fromApp from '../../../store/app.reducer';
import { FormControl, Validators } from '@angular/forms';
import * as UsersActions from '../../../users/store/users.actions';

@Component({
  selector: 'app-confirmation-dialog-with-notes',
  templateUrl: './confirmation-dialog-with-notes.component.html',
  styleUrls: ['./confirmation-dialog-with-notes.component.scss'],
})
export class ConfirmationDialogWithNotesComponent {
  reason = new FormControl('', [
    Validators.required,
    Validators.maxLength(200),
  ]);

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title: string;
      text: string;
      actionType: string;
      additionalData: any[];
    },
    private store: Store<fromApp.AppState>
  ) {}

  confirm() {
    switch (this.data.actionType) {
      case UsersActions.TOGGLE_USER_IS_BLOCKED:
        this.store.dispatch(
          new UsersActions.ToggleUserIsBlocked({
            email: this.data.additionalData[0],
            reason: this.reason.value,
          })
        );
        break;
      default:
        break;
    }
  }
}
