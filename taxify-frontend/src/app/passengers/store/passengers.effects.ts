import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, map } from 'rxjs';
import { AppConfig } from 'src/app/appConfig/appconfig.interface';
import { APP_SERVICE_CONFIG } from 'src/app/appConfig/appconfig.service';
import { Notification } from '../model/notification';
import * as PassengerActions from './passengers.actions';

@Injectable()
export class PassengerEffects {
  linkPassengersForRide = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PassengerActions.ADD_LINKED_PASSENGERS),
        switchMap(
          (addLinkedPassengers: PassengerActions.AddLinkedPassengers) => {
            return this.http
              .post(this.config.apiEndpoint + 'notification/addToTheRide', {
                senderEmail: addLinkedPassengers.payload.sender,
                recipientsEmails: addLinkedPassengers.payload.linkedUsers,
              })
              .pipe(
                map(() => {
                  console.log('poslala si');
                })
              );
          }
        )
      ),
    { dispatch: false }
  );

  getPassengerNotifications = createEffect(() =>
    this.actions$.pipe(
      ofType(PassengerActions.GET_PASSENGER_NOTIFICATIONS),
      switchMap(
        (getNotifications: PassengerActions.GetPassengerNotifications) => {
          return this.http
            .get(this.config.apiEndpoint + 'notification/all', {})
            .pipe(
              map((notifications: Notification[]) => {
                return new PassengerActions.SetPassengerNotifications(
                  notifications
                );
              })
            );
        }
      )
    )
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    @Inject(APP_SERVICE_CONFIG) private config: AppConfig
  ) {}
}
