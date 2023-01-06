export class User {
  constructor(
    public id: number,
    public name: string,
    public surname: string,
    public phoneNumber: string,
    public email: string,
    public profilePicture: string,
    public city: string
  ) {}
}
