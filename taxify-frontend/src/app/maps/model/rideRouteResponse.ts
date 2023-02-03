import { Driver } from "src/app/shared/model/driver.model";
import { Route } from "./route";

export class RideRouteResponse{
    constructor (public route: Map<string, Route>, public driver: Driver, public rideStatus: string, public distance: number ){};
}