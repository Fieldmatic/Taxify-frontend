import { Vehicle } from './vehicle.model';

export interface Driver {
  id: number;
  name: string;
  surname: string;
  phoneNumber: string;
  email: string;
  profilePicture: string;
  vehicle: Vehicle;
}
