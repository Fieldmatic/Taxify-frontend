export class Notification {
  constructor(
    public id: number,
    public type: string,
    public senderName: string,
    public senderSurname: string,
    public arrivalTime: Date,
    public read: boolean,
    public status: string,
    public userStatusChangeReason: string
  ) {}
}
