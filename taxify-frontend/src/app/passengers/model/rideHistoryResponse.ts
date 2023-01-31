export class RideHistoryResponse {
    constructor(public id: string, public route: string, public price: number, public scheduledAt: Date, public finishedAt: Date) {}
}