import { FacebookUserResponse } from './facebook-user-response';

export class FacebookSignupRequest {
  email: string;
  firstName: string;
  lastName: string;
  city: string;
  phoneNumber: string;
  id: string;

  constructor(
    facebookApiResponse: FacebookUserResponse,
    city: string,
    phoneNumber: string
  ) {
    this.email = facebookApiResponse.email;
    this.firstName = facebookApiResponse.first_name;
    this.lastName = facebookApiResponse.last_name;
    this.id = facebookApiResponse.id;
    this.city = city;
    this.phoneNumber = phoneNumber;
  }
}
