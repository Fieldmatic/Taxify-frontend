import { User } from "./user.model";

export class RideHistoryResponse {
    constructor(public id: string, public route: string,public fullLocationNames: string[], public passengers: User[], public price: number, public scheduledAt: Date, public finishedAt: Date) {}
}
