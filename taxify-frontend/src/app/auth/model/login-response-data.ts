export class LoginResponseData {
  constructor(
    public token: string,
    public expiresIn: number,
    public role: string,
    public email?: string
  ) {}
}
