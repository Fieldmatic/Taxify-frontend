import { Action } from '@ngrx/store';
import { Notification } from '../../shared/model/notification';

export const ADD_LINKED_PASSENGERS = '[Passenger] Add Linked Passengers';
export const GET_PASSENGER_NOTIFICATIONS =
  '[Passenger] Get Passenger Notifications';

export const SET_PASSENGER_NOTIFICATIONS =
  '[Passenger] Set Passenger Notifications';

export const ANSWER_ON_ADDING_TO_THE_RIDE =
  '[Passenger] Answer on adding to the ride';

export const SET_PASSENGER_NOTIFICATION =
  '[Passenger] Set Passenger Notification';

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

  constructor(
    public payload: {
      notificationId: number;
      answer: string;
      paymentMethodId: string;
    }
  ) {}
}

export class SetPassengerNotification implements Action {
  readonly type = SET_PASSENGER_NOTIFICATION;

  constructor(public payload: Notification) {}
}

export type PassengerActions =
  | AddLinkedPassengers
  | GetPassengerNotifications
  | SetPassengerNotifications
  | AnswerOnAddingToTheRide
  | SetPassengerNotification;
