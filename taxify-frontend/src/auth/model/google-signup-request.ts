export class GoogleSignUpRequest {
  credentials: string;
  city: string;
  phoneNumber: string;

  constructor(credentials: string, city: string, phoneNumber: string) {
    this.credentials = credentials;
    this.city = city;
    this.phoneNumber = phoneNumber;
  }
}
