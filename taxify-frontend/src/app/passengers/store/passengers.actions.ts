import { Action } from '@ngrx/store';
import { Notification } from '../model/notification';

export const ADD_LINKED_PASSENGERS = '[Passenger] Add Linked Passengers';
export const GET_PASSENGER_NOTIFICATIONS =
  '[Passenger] Get Passenger Notifications';

export const SET_PASSENGER_NOTIFICATIONS =
  '[Passenger] Set Passenger Notifications';

export class AddLinkedPassengers implements Action {
  readonly type = ADD_LINKED_PASSENGERS;

  constructor(public payload: { sender: string; linkedUsers: string[] }) {}
}

export class GetPassengerNotifications implements Action {
  readonly type = GET_PASSENGER_NOTIFICATIONS;
}

export class SetPassengerNotifications implements Action {
  readonly type = SET_PASSENGER_NOTIFICATIONS;

  constructor(public payload: Notification[]) {}
}

export type PassengerActions =
  | AddLinkedPassengers
  | GetPassengerNotifications
  | SetPassengerNotifications;
