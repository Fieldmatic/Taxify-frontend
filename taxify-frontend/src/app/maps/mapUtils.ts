import { Coordinate } from 'ol/coordinate';
import { Feature, Map, Overlay, View } from 'ol';
import { Point } from 'ol/geom';
import * as olProj from 'ol/proj';
import { Icon, Style } from 'ol/style';
import { Vehicle } from '../shared/vehicle.model';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import TileLayer from 'ol/layer/Tile';
import { OSM } from 'ol/source';
import { MapData } from './mapData.model';
import { Layer } from 'ol/layer';

export const createMapCenterMarker = function (mapCenter: Coordinate): Feature {
  let marker = new Feature({
    geometry: new Point(olProj.fromLonLat(mapCenter)),
  });
  marker.setStyle(
    new Style({
      image: new Icon({
        anchor: [0.5, 1],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        opacity: 1,
        src: '../assets/location.png',
      }),
    })
  );
  return marker;
};

export const creatInitialMap = function (mapCenter: Coordinate): Map {
  return createMapWithVehiclesLayer(mapCenter, []);
};

export const createVehicleFeatures = function (vehicles: Vehicle[]): Feature[] {
  let markers: Feature[] = [];
  for (let vehicle of vehicles) {
    let marker = new Feature({
      geometry: new Point(olProj.fromLonLat(vehicle.location)),
      id: vehicles.indexOf(vehicle),
    });
    marker.setStyle(
      new Style({
        image: new Icon({
          anchor: [0.5, 46],
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          opacity: 1,
          src: '../assets/car_icon.png',
        }),
      })
    );
    markers.push(marker);
  }
  return markers;
};

export const createMapVehicleLayer = function (
  mapCenter: Coordinate,
  vehicles: Vehicle[]
): Layer {
  const vectorSource = new VectorSource({
    features: createVehicleFeatures(vehicles),
  });

  return new VectorLayer({
    source: vectorSource,
  });
};

export const createMapDriversOverlay = function (
  container: HTMLElement
): Overlay {
  return new Overlay({
    element: container,
    autoPan: {
      animation: {
        duration: 250,
      },
    },
    id: 'drivers',
  });
};

export const createMapWithVehiclesLayer = function (
  mapCenter: Coordinate,
  vehicles: Vehicle[]
): Map {
  return new Map({
    target: 'map',
    layers: [
      new TileLayer({
        source: new OSM(),
      }),
      createMapVehicleLayer(mapCenter, vehicles),
    ],
    view: new View({
      center: olProj.fromLonLat(mapCenter),
      zoom: 17,
    }),
  });
};

export const getMapData = function (map: Map): MapData {
  let extent = map.getView().calculateExtent(map.getSize());
  extent = olProj.transformExtent(extent, 'EPSG:3857', 'EPSG:4326');
  let mapCenter = map.getView().getCenter();
  mapCenter = olProj.transform(mapCenter, 'EPSG:3857', 'EPSG:4326');
  return {
    mapCenter: mapCenter,
    minLng: extent[0],
    maxLng: extent[2],
    minLat: extent[1],
    maxLat: extent[3],
  };
};
