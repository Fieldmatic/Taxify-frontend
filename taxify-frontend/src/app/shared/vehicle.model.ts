import { Coordinate } from 'ol/coordinate';

export interface Vehicle {
  id: number;
  location: Coordinate;
  brand: string;
  model: string;
  horsePower: string;
}
