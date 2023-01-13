export class Location {
  address: string;
  latitude: number;
  longitude: number;
  constructor(latitude?: number, longitude?: number, address?: string) {
    this.longitude = longitude;
    this.latitude = latitude;
    if (address) this.address = address;
  }
}
