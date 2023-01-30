import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { anyInputValidator } from '../../../../../shared/validators/any-input-filled.validator';
import { SafeUrl } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { Store } from '@ngrx/store';
import * as fromApp from '../../../../../store/app.reducer';
import * as CustomerSupportActions from '../../../../store/customer-support.actions';

@Component({
  selector: 'app-message-input',
  templateUrl: './message-input.component.html',
  styleUrls: ['./message-input.component.scss'],
})
export class MessageInputComponent implements OnInit {
  @Input() disabled: boolean;
  messageForm: FormGroup;
  fileReader = new FileReader();
  imageSnippet: SafeUrl = null;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.messageForm = new FormGroup(
      {
        message: new FormControl(''),
        image: new FormControl(null),
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
        receiverEmail: null,
      })
    );
    this.messageForm.controls['message'].setValue('');
  }

  processFile() {
    if (this.messageForm.value['image']) {
      const file: File = this.messageForm.value['image'].files[0];

      this.fileReader.removeAllListeners();
      this.fileReader.addEventListener('load', (event: any) => {
        this.imageSnippet = this.document.defaultView.URL.createObjectURL(file);
        this.messageForm.controls['message'].disable();
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

  removeImage() {
    this.messageForm.controls['image'].setValue(null);
    this.imageSnippet = null;
    this.messageForm.controls['message'].enable();
  }

  disableImage(event: any) {
    if (!event.target.value) {
      this.messageForm.controls['image'].enable();
    } else {
      this.messageForm.controls['image'].disable();
    }
  }

  getButtonBackground() {
    if (this.messageForm.controls['image'].enabled) {
      return 'url("/assets/add-image.png")';
    } else {
      return 'url("/assets/add-image-disabled.png")';
    }
  }
}
