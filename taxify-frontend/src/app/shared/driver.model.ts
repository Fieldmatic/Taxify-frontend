import { Vehicle } from './vehicle.model';
import { User } from './user.model';

export class Driver extends User {
  constructor(
    id: number,
    name: string,
    surname: string,
    phoneNumber: string,
    email: string,
    profilePicture: string,
    city: string,
    public active: boolean,
    public remainingWorkTime: number,
    public vehicle: Vehicle
  ) {
    super(id, name, surname, phoneNumber, email, profilePicture, city);
  }
}
