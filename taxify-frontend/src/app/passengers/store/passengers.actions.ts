import { Action } from '@ngrx/store';
import { RideRouteResponse } from 'src/app/maps/model/rideRouteResponse';
import { Notification } from '../model/notification';
import { RideHistoryResponse } from '../model/rideHistoryResponse';

export const ADD_LINKED_PASSENGERS = '[Passenger] Add Linked Passengers';
export const GET_PASSENGER_NOTIFICATIONS =
  '[Passenger] Get Passenger Notifications';

export const SET_PASSENGER_NOTIFICATIONS =
  '[Passenger] Set Passenger Notifications';

export const ANSWER_ON_ADDING_TO_THE_RIDE =
  '[Passenger] Answer on adding to the ride';

export const SET_PASSENGER_NOTIFICATION =
  '[Passenger] Set Passenger Notification';

export const MAKE_COMPLAINT = '[Passenger] Make complaint';
export const LOAD_PASSENGER_RIDE_HISTORY =
  '[Passenger] Load passenger ride history';
export const SET_PASSENGER_RIDE_HISTORY =
  '[Passenger] Set passenger ride history';
export const LOAD_SELECTED_ROUTE_DETAILS =
  '[Passenger] Load selected route details';
export const SET_SELECTED_ROUTE_DETAILS =
  '[Passenger] Set selected route details';
export const REORDER_RIDE = '[Passenger] Reorder ride';

export const LEAVE_REVIEW_START = '[Passenger] Leave review start';
export const LEAVE_REVIEW = '[Passenger] Leave review';

export class AddLinkedPassengers implements Action {
  readonly type = ADD_LINKED_PASSENGERS;

  constructor(public payload: { sender: string; linkedUsers: string[] }) {}
}

export class GetPassengerNotifications implements Action {
  readonly type = GET_PASSENGER_NOTIFICATIONS;

  constructor(public payload: { markNotificationsAsRead: boolean }) {}
}

export class SetPassengerNotifications implements Action {
  readonly type = SET_PASSENGER_NOTIFICATIONS;

  constructor(public payload: Notification[]) {}
}

export class AnswerOnAddingToTheRide implements Action {
  readonly type = ANSWER_ON_ADDING_TO_THE_RIDE;

  constructor(public payload: { notificationId: number; answer: string }) {}
}

export class SetPassengerNotification implements Action {
  readonly type = SET_PASSENGER_NOTIFICATION;

  constructor(public payload: Notification) {}
}

export class MakeComplaint implements Action {
  readonly type = MAKE_COMPLAINT;

  constructor(public payload: { complaint: string }) {}
}

export class LeaveReviewStart implements Action {
  readonly type = LEAVE_REVIEW_START;

  constructor(
    public payload: {
      comment: string;
      driverRating: number;
      vehicleRating: number;
    }
  ) {}
}

export class LeaveReview implements Action {
  readonly type = LEAVE_REVIEW;

  constructor(
    public payload: {
      rideId: string;
      comment: string;
      driverRating: number;
      vehicleRating: number;
    }
  ) {}
}

export class LoadPassengerRideHistory implements Action {
  readonly type = LOAD_PASSENGER_RIDE_HISTORY;
  constructor() {}
}

export class SetPassengerRideHistory implements Action {
  readonly type = SET_PASSENGER_RIDE_HISTORY;
  constructor(public payload: { rides: RideHistoryResponse[] }) {}
}

export class LoadSelectedRouteDetails implements Action {
  readonly type = LOAD_SELECTED_ROUTE_DETAILS;
  constructor(public payload: { id: string }) {}
}

export class SetSelectedRouteDetails implements Action {
  readonly type = SET_SELECTED_ROUTE_DETAILS;
  constructor(public payload: { rideRouteInfo: RideRouteResponse }) {}
}

export class ReorderRide implements Action {
  readonly type = REORDER_RIDE;
  constructor(public payload: { rideId: string }) {}
}

export type PassengerActions =
  | AddLinkedPassengers
  | GetPassengerNotifications
  | SetPassengerNotifications
  | AnswerOnAddingToTheRide
  | SetPassengerNotification
  | LoadPassengerRideHistory
  | SetPassengerRideHistory
  | LoadSelectedRouteDetails
  | SetSelectedRouteDetails
  | ReorderRide;
