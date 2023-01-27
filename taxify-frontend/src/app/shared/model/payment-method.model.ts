export class PaymentMethod {
  constructor(
    public id: string,
    public type: string,
    public card: PaymentCard
  ) {}
}

export class PaymentCard {
  constructor(
    public brand: string,
    public expMonth: string,
    public expYear: string,
    public last4: string,
    public issuer: string
  ) {}
}
