import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { User } from 'src/app/shared/model/user.model';
import { valuesChangedValidator } from '../../../../../shared/validators/values-changed.validator';
import * as fromApp from '../../../../../store/app.reducer';
import * as UsersActions from '../../../../store/users.actions';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { DOCUMENT } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-user-data-edit',
  templateUrl: './user-data-edit.component.html',
  styleUrls: ['./user-data-edit.component.scss'],
})
export class UserDataEditComponent implements OnInit, OnDestroy {
  editForm: FormGroup;
  oldUserValues: User;
  oldProfilePicture: Blob;
  fileReader = new FileReader();
  imageSnippet: SafeUrl = null;
  usersSubscription: Subscription;
  loading: boolean;
  readonly maxProfilePictureSize = 10 * 2 ** 20;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private sanitizer: DomSanitizer,
    private store: Store<fromApp.AppState>,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    let email = '';
    let name = '';
    let surname = '';
    let phoneNumber = '';
    let city = '';
    let profilePicture = null;
    this.usersSubscription = this.store
      .select('users')
      .subscribe((usersState) => {
        if (usersState.loggedUserProfilePicture) {
          this.fileReader.removeAllListeners();
          this.fileReader.addEventListener('load', (event: any) => {
            this.imageSnippet = this.sanitizer.bypassSecurityTrustUrl(
              this.document.defaultView.URL.createObjectURL(
                usersState.loggedUserProfilePicture
              )
            );
          });
          this.fileReader.readAsDataURL(usersState.loggedUserProfilePicture);
        }
        this.loading = usersState.loading;
        this.oldUserValues = usersState.loggedUser;
        this.oldProfilePicture = usersState.loggedUserProfilePicture;
        email = this.oldUserValues.email;
        name = this.oldUserValues.name;
        surname = this.oldUserValues.surname;
        phoneNumber = this.oldUserValues.phoneNumber;
        city = this.oldUserValues.city;
        profilePicture = this.oldProfilePicture;
      });

    this.editForm = new FormGroup(
      {
        email: new FormControl(email),
        name: new FormControl(name, Validators.required),
        surname: new FormControl(surname, Validators.required),
        phoneNumber: new FormControl(phoneNumber, Validators.required),
        city: new FormControl(city, Validators.required),
        profilePicture: new FormControl(profilePicture, [Validators.required]),
      },
      {
        validators: [
          valuesChangedValidator({
            name: this.oldUserValues.name,
            surname: this.oldUserValues.surname,
            phoneNumber: this.oldUserValues.phoneNumber,
            city: this.oldUserValues.city,
            profilePicture: this.oldProfilePicture,
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
        action: new UsersActions.SaveLoggedUserChanges({
          ...this.editForm.value,
          profilePicture: this.editForm.value['profilePicture'].files[0],
        }),
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
    if (this.oldProfilePicture != formValue.profilePicture) {
      dialogText += 'Profile picture' + '<br/>';
    }
    dialogText += '?';
    return dialogText;
  }

  processFile() {
    if (this.editForm.value['profilePicture']) {
      const file: File = this.editForm.value['profilePicture'].files[0];

      this.fileReader.removeAllListeners();
      this.fileReader.addEventListener('load', (event: any) => {
        this.imageSnippet = this.document.defaultView.URL.createObjectURL(file);
      });

      this.fileReader.readAsDataURL(file);
    }
  }

  getBackgroundImageUrl(url) {
    return `url("${this.getUrl(url)}")`;
  }

  getUrl(url): string {
    if (url.hasOwnProperty('changingThisBreaksApplicationSecurity')) {
      return url.changingThisBreaksApplicationSecurity;
    } else {
      return url;
    }
  }
}
