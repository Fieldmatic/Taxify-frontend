import { Coordinate } from 'ol/coordinate';

export interface Vehicle {
  id: number;
  occupied: boolean;
  location: Coordinate;
  brand: string;
  model: string;
  horsePower: string;
  type: string;
}
