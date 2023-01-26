import * as fromApp from '../../store/app.reducer';
import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { LoggedInUser } from 'src/app/auth/model/logged-in-user';

@Directive({
  selector: '[appHasRole]',
})
export class HasRoleDirective {
  currentUser!: LoggedInUser;
  requiredRoles!: string[];
  isVisible = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.store
      .select('auth')
      .pipe(map((authState) => authState.user))
      .subscribe((user: LoggedInUser) => {
        this.currentUser = user;
        this.updateView();
      });
  }

  @Input()
  set appHasRole(roles: string[]) {
    this.requiredRoles = roles;
    this.updateView();
  }

  private updateView() {
    if (this.hasRole()) {
      if (!this.isVisible) {
        this.isVisible = true;
        this.viewContainer.createEmbeddedView(this.templateRef);
      }
    } else {
      this.isVisible = false;
      this.viewContainer.clear();
    }
  }

  private hasRole(): boolean {
    if (this.currentUser && this.currentUser.role && this.requiredRoles) {
      return this.requiredRoles.includes(this.currentUser.role);
    }
    return false;
  }
}
