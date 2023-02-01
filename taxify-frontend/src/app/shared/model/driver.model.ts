import { Vehicle } from './vehicle.model';
import { User } from './user.model';
import { Ride } from './ride.model';

export class Driver extends User {
  constructor(
    id: number,
    name: string,
    surname: string,
    phoneNumber: string,
    email: string,
    profilePicture: string,
    city: string,
    blocked: boolean,
    role: string,
    public active: boolean,
    public remainingWorkTime: number,
    public vehicle: Vehicle,
    public ride?: Ride
  ) {
    super(
      id,
      name,
      surname,
      phoneNumber,
      email,
      profilePicture,
      city,
      blocked,
      role
    );
  }
}
