import { User } from '../../shared/model/user.model';

export class Message {
  constructor(
    public id: string,
    public status: string,
    public content: string,
    public createdOn: Date,
    public seenOn: Date,
    public deliveredOn: Date,
    public repliedOn: Date,
    public sender: User,
    public receiver: User
  ) {}
}
