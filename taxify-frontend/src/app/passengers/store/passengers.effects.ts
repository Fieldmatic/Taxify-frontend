import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ToastrService } from 'ngx-toastr';
import { map, switchMap } from 'rxjs';
import { AppConfig } from 'src/app/appConfig/appconfig.interface';
import { APP_SERVICE_CONFIG } from 'src/app/appConfig/appconfig.service';
import { Ride } from 'src/app/shared/model/ride.model';
import { RideRouteResponse } from 'src/app/maps/model/rideRouteResponse';
import { Notification } from '../../shared/model/notification';
import { RideHistoryResponse } from '../../shared/model/rideHistoryResponse';
import * as PassengerActions from './passengers.actions';
import * as MapsActions from '../../maps/store/maps.actions';

@Injectable()
export class PassengerEffects {
  linkPassengersForRide = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PassengerActions.ADD_LINKED_PASSENGERS),
        switchMap(
          (addLinkedPassengers: PassengerActions.AddLinkedPassengers) => {
            return this.http.post(
              this.config.apiEndpoint + 'notification/addToTheRide',
              {
                senderEmail: addLinkedPassengers.payload.sender,
                recipientsEmails: addLinkedPassengers.payload.linkedUsers,
              }
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
            .get(
              this.config.apiEndpoint +
                'notification/all/' +
                getNotifications.payload.markNotificationsAsRead,
              {}
            )
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

  answerOnAddingToTheRide = createEffect(() =>
    this.actions$.pipe(
      ofType(PassengerActions.ANSWER_ON_ADDING_TO_THE_RIDE),
      switchMap(
        (answerOnAddingToTheRide: PassengerActions.AnswerOnAddingToTheRide) => {
          if (answerOnAddingToTheRide.payload.answer === 'accept')
            return this.http
              .put(
                this.config.apiEndpoint +
                  'notification/acceptAddingToTheRide/' +
                  answerOnAddingToTheRide.payload.notificationId +
                  answerOnAddingToTheRide.payload.paymentMethodId,
                {}
              )
              .pipe(
                map((notification: Notification) => {
                  return new PassengerActions.SetPassengerNotification(
                    notification
                  );
                })
              );
          else {
            return this.http
              .put(
                this.config.apiEndpoint +
                  'notification/rejectAddingToTheRide/' +
                  answerOnAddingToTheRide.payload.notificationId,
                {}
              )
              .pipe(
                map((notification: Notification) => {
                  return new PassengerActions.SetPassengerNotification(
                    notification
                  );
                })
              );
          }
        }
      )
    )
  );

  makeComplaint = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PassengerActions.MAKE_COMPLAINT),
        switchMap((makeComplaint: PassengerActions.MakeComplaint) => {
          return this.http
            .post(this.config.apiEndpoint + 'passenger/complaint', {
              complaintReason: makeComplaint.payload.complaint,
            })
            .pipe(
              map(() => {
                this.showToast('Your complaint has been saved.');
              })
            );
        })
      ),
    { dispatch: false }
  );

  leaveReviewStart = createEffect(() =>
    this.actions$.pipe(
      ofType(PassengerActions.LEAVE_REVIEW_START),
      switchMap((leaveReview: PassengerActions.LeaveReviewStart) => {
        return this.http
          .get<Ride>(this.config.apiEndpoint + 'ride/lastFinishedRide')
          .pipe(
            map((ride) => {
              return new PassengerActions.LeaveReview({
                rideId: ride.id,
                comment: leaveReview.payload.comment,
                driverRating: leaveReview.payload.driverRating,
                vehicleRating: leaveReview.payload.vehicleRating,
              });
            })
          );
      })
    )
  );

  leaveReview = createEffect(() =>
    this.actions$.pipe(
      ofType(PassengerActions.LEAVE_REVIEW),
      switchMap((leaveReview: PassengerActions.LeaveReview) => {
        return this.http
          .post(this.config.apiEndpoint + 'passenger/review', {
            rideId: leaveReview.payload.rideId,
            driverRating: leaveReview.payload.driverRating,
            vehicleRating: leaveReview.payload.vehicleRating,
            comment: leaveReview.payload.comment,
          })
          .pipe(
            map(() => {
              this.showToast('You have successfully rated the driver.');
              return new MapsActions.ResetStateAfterRideFinish();
            })
          );
      })
    )
  );

  showToast(message: string) {
    this.toastr.info(message, 'Notification', {
      timeOut: 5000,
      closeButton: true,
      tapToDismiss: true,
      newestOnTop: true,
      positionClass: 'toast-top-center',
    });
  }
  loadPassengerRideHistory = createEffect(() =>
    this.actions$.pipe(
      ofType(PassengerActions.LOAD_PASSENGER_RIDE_HISTORY),
      switchMap(
        (
          loadPassengerRideHistory: PassengerActions.LoadPassengerRideHistory
        ) => {
          return this.http
            .get<RideHistoryResponse[]>(
              this.config.apiEndpoint + 'ride/rideHistory',
              {}
            )
            .pipe(
              map((rideHistoryResponse: RideHistoryResponse[]) => {
                return new PassengerActions.SetPassengerRideHistory({
                  rides: rideHistoryResponse,
                });
              })
            );
        }
      )
    )
  );

  loadSelectedRouteDetails = createEffect(() =>
    this.actions$.pipe(
      ofType(PassengerActions.LOAD_SELECTED_ROUTE_DETAILS),
      switchMap(
        (
          loadSelectedRouteDetails: PassengerActions.LoadSelectedRouteDetails
        ) => {
          return this.http
            .get<RideRouteResponse>(
              this.config.apiEndpoint +
                'ride/getRouteDetails/' +
                loadSelectedRouteDetails.payload.id
            )
            .pipe(
              map((rideRouteResponse: RideRouteResponse) => {
                return new PassengerActions.SetSelectedRouteDetails({
                  rideRouteInfo: rideRouteResponse,
                });
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
    @Inject(APP_SERVICE_CONFIG) private config: AppConfig,
    private toastr: ToastrService
  ) {}
}
