export class Route {
  distance: number;
  duration: number;
  route: [longitude: number, latitude: number][];
  constructor(
    distance: number,
    duration: number,
    route: [longitude: number, latitude: number][]
  ) {
    this.distance = distance;
    this.duration = duration;
    this.route = route;
  }
}
