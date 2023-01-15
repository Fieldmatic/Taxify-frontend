import { Coordinate } from 'ol/coordinate';

export interface MapData {
  mapCenter: Coordinate;
  minLng: number;
  maxLng: number;
  minLat: number;
  maxLat: number;
}
