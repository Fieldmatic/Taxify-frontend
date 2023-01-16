import { GetDriverRemainingWorkTime } from './../../../drivers/store/drivers.actions';
import { LoggedInUser } from 'src/app/auth/model/logged-in-user';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from '../../../store/app.reducer';
import { map, min } from 'rxjs';
import * as DriversActions from 'src/app/drivers/store/drivers.actions';
import { Driver } from 'src/app/shared/driver.model';
import { LongDateFormatKey } from 'moment';

@Component({
  selector: 'app-driver-map-info',
  templateUrl: './driver-map-info.component.html',
  styleUrls: ['./driver-map-info.component.scss'],
})
export class DriverMapInfoComponent implements OnInit {
  loggedInUser: LoggedInUser = null;
  driver: Driver;
  driverRemainingWorkTime: { hours: number; minutes: number };

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit(): void {
    this.store
      .select('auth')
      .pipe(map((authState) => authState.user))
      .subscribe((user: LoggedInUser) => {
        //ako je ulogovan vozac
        if (user) {
          this.loggedInUser = user;
          this.store.dispatch(
            new DriversActions.GetDriverInfo({ email: user.email })
          );
          this.store.dispatch(
            new DriversActions.GetDriverRemainingWorkTime({ email: user.email })
          );
        } else {
          this.store.dispatch(new DriversActions.SetDriver(null));
        }
      });

    this.store.select('drivers').subscribe((driverState) => {
      this.driver = driverState.driver;
      let hours = driverState.driverRemainingWorkTime / 60;
      let roundHours = Math.floor(hours);
      let minutes = Math.round((hours - roundHours) * 60);
      this.driverRemainingWorkTime = {
        hours: roundHours,
        minutes: minutes,
      };
    });
  }

  public changeDriverStatus() {
    this.store.dispatch(
      new DriversActions.ChangeDriverStatus({
        email: this.driver.email,
        active: this.driver.active,
      })
    );
  }
}
