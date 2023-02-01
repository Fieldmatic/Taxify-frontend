import { Driver } from "src/app/shared/driver.model";
import { Route } from "./route";

export class RideRouteResponse{
    constructor (public route: Map<string, Route>, public driver: Driver, public rideStatus: string ){};
}