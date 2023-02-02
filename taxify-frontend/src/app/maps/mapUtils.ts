import { Coordinate } from 'ol/coordinate';
import { Feature, Map, Overlay, View } from 'ol';
import { Point } from 'ol/geom';
import * as olProj from 'ol/proj';
import { Icon, Stroke, Style } from 'ol/style';
import { Vehicle } from '../shared/model/vehicle.model';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import TileLayer from 'ol/layer/Tile';
import { OSM } from 'ol/source';
import { MapData } from './model/mapData.model';
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
    marker.setId(vehicles.indexOf(vehicle));
    marker.setStyle(
      new Style({
        image: new Icon({
          anchor: [0.5, 46],
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          opacity: 1,
          src: '../assets/car_icon.png',
          scale: 0.8,
        }),
        zIndex: 999,
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

export const createRoutesLayer = function (): Layer {
  const styles = {
    route: new Style({
      stroke: new Stroke({
        width: 6,
        color: [0, 0, 0],
      }),
    }),
  };

  return new VectorLayer({
    source: new VectorSource({
      features: [],
    }),
    style: function (feature) {
      return styles[feature.get('type')];
    },
  });
};
export const createLocationsLayer = function (): Layer {
  const vectorSource = new VectorSource({
    features: [],
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

export const createEmptyMap = function (
  mapCenter: Coordinate,
): Map {
  return new Map({
    layers: [
      new TileLayer({
        source: new OSM(),
      }),
      createLocationsLayer(),
      createRoutesLayer(),
    ],
    view: new View({
      center: olProj.fromLonLat(mapCenter),
      zoom: 14,
    }),
  });
};

export const createMapWithVehiclesLayer = function (
  mapCenter: Coordinate,
  vehicles: Vehicle[]
): Map {
  return new Map({
    layers: [
      new TileLayer({
        source: new OSM(),
      }),
      createMapVehicleLayer(mapCenter, vehicles),
      createLocationsLayer(),
      createRoutesLayer(),
      createRoutesLayer(),
    ],
    view: new View({
      center: olProj.fromLonLat(mapCenter),
      zoom: 15,
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

export const getMarker = function (lon, lat) {
  return new Feature({
    geometry: new Point(olProj.fromLonLat([lon, lat])),
  });
};
