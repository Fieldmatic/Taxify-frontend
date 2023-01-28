import { Component, Inject, Input } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import * as fromApp from '../../store/app.reducer';

@Component({
  selector: 'app-navbar-profile-menu',
  templateUrl: './navbar-profile-menu.component.html',
  styleUrls: ['./navbar-profile-menu.component.scss'],
})
export class NavbarProfileMenuComponent {
  @Input() role: string;
  fileReader: FileReader = new FileReader();
  imageSnippet: SafeUrl = null;
  usersSubscription: Subscription;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private sanitizer: DomSanitizer,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
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
      });
  }

  ngOnDestroy(): void {
    this.usersSubscription.unsubscribe();
  }

  getBackgroundImageUrl(url) {
    return `url("${url.changingThisBreaksApplicationSecurity}")`;
  }

  getRouterLink() {
    switch (this.role) {
      case 'PASSENGER':
        return '/users/profile/history';
      default:
        return '/users/profile/edit';
    }
  }
}
