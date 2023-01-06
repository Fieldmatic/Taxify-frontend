import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { User } from 'src/app/shared/user.model';
import { valuesChangedValidator } from '../../shared/values-changed.validator';
import * as fromApp from '../../store/app.reducer';
import * as UsersActions from '../store/users.actions';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-user-profile-edit',
  templateUrl: './user-profile-edit.component.html',
  styleUrls: ['./user-profile-edit.component.scss'],
})
export class UserProfileEditComponent implements OnInit, OnDestroy {
  editForm: FormGroup;
  oldUserValues: User;
  usersSubscription: Subscription;
  loading: boolean;

  constructor(
    private store: Store<fromApp.AppState>,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    let email = '';
    let name = '';
    let surname = '';
    let phoneNumber = '';
    let city = '';
    this.usersSubscription = this.store
      .select('users')
      .subscribe((usersState) => {
        this.loading = usersState.loading;
        this.oldUserValues = usersState.loggedUser;
        email = this.oldUserValues.email;
        name = this.oldUserValues.name;
        surname = this.oldUserValues.surname;
        phoneNumber = this.oldUserValues.phoneNumber;
        city = this.oldUserValues.city;
      });

    this.editForm = new FormGroup(
      {
        email: new FormControl(email),
        name: new FormControl(name, Validators.required),
        surname: new FormControl(surname, Validators.required),
        phoneNumber: new FormControl(phoneNumber, Validators.required),
        city: new FormControl(city, Validators.required),
      },
      {
        validators: [
          valuesChangedValidator({
            name: this.oldUserValues.name,
            surname: this.oldUserValues.surname,
            phoneNumber: this.oldUserValues.phoneNumber,
            city: this.oldUserValues.city,
          }),
        ],
      }
    );
    this.editForm.controls['email'].disable();
  }

  ngOnDestroy(): void {
    this.usersSubscription.unsubscribe();
  }

  onSubmit() {
    this.dialog.open(ConfirmationDialogComponent, {
      width: 'fit-content',
      data: {
        title: 'Profile Edit',
        text: this.createDialogText(),
        action: new UsersActions.SaveLoggedUserChanges(this.editForm.value),
      },
    });
  }

  private createDialogText(): string {
    const formValue = this.editForm.value;
    let dialogText = 'Do you want to change: <br/>';
    if (this.oldUserValues.name !== formValue.name) {
      dialogText += 'Name to ' + formValue.name + '<br/>';
    }
    if (this.oldUserValues.surname !== formValue.surname) {
      dialogText += 'Surname to ' + formValue.surname + '<br/>';
    }
    if (this.oldUserValues.phoneNumber !== formValue.phoneNumber) {
      dialogText += 'Phone number to ' + formValue.phoneNumber + '<br/>';
    }
    if (this.oldUserValues.city !== formValue.city) {
      dialogText += 'City to ' + formValue.city + '<br/>';
    }
    dialogText += '?';
    return dialogText;
  }
}
