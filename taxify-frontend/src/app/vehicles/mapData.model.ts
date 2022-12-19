import { Coordinate } from 'ol/coordinate';

export class MapData {
  constructor(
    public mapCenter: Coordinate,
    public minLng: number,
    public maxLng: number,
    public minLat: number,
    public maxLat: number
  ) {}
}
