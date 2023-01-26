import { Feature, Overlay } from 'ol';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as MapActions from './store/maps.actions';
import * as MapUtils from './mapUtils';
import { Driver } from '../shared/driver.model';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, take } from 'rxjs';
import { Vehicle } from '../shared/vehicle.model';
import VectorSource from 'ol/source/Vector';
import { LineString, Point } from 'ol/geom';
import { fromLonLat } from 'ol/proj';
import { Icon, Stroke, Style } from 'ol/style';
import { Location } from './model/location';
import { PassengerState } from './model/passengerState';
import { Coordinate } from 'ol/coordinate';
import OLMap from 'ol/Map';

@Injectable()
export class MapsService {
  private mapSource = new BehaviorSubject<OLMap>(this.initMap());
  map = this.mapSource.asObservable();
  s;
  driversInArea: Driver[] = [];
  driversSubscription: Subscription;

  mapsSubscription: Subscription;

  vehicles: Vehicle[] = [];
  error: number;
  chosenDriverInfo: Driver;
  rideDriver: Driver;
  passengerState: PassengerState;
  locationsVectorSource: VectorSource;
  routesVectorSource: VectorSource;
  drivingRouteVectorSource: VectorSource;
  vehiclesVectorSource: VectorSource;
  selectedRoute$: Observable<
    Map<string, [longitude: number, latitude: number][]>
  >;
  availableRoutes$: Observable<
    Map<string, [longitude: number, latitude: number][][]>
  >;
  availableRoutes: Map<string, [longitude: number, latitude: number][][]>;

  constructor(private store: Store<fromApp.AppState>) {
    this.recenterToUserLocation();
    this.addMapEvents();
    this.vehiclesVectorSource = <VectorSource>(
      this.mapSource.value.getAllLayers()[1].getSource()
    );
    this.subscribeToDriversStore();
    this.locationsVectorSource = <VectorSource>(
      this.mapSource.value.getAllLayers()[2].getSource()
    );
    this.routesVectorSource = <VectorSource>(
      this.mapSource.value.getAllLayers()[3].getSource()
    );
    this.drivingRouteVectorSource = <VectorSource>(
      this.mapSource.value.getAllLayers()[4].getSource()
    );
    this.locationsVectorSource.on(
      'change',
      this.locationsVectorOnChangeCallback
    );
    this.selectedRoute$ = this.store.select(
      (store) => store.maps.selectedRoute
    );
    this.availableRoutes$ = this.store.select(
      (store) => store.maps.availableRoutes
    );
    this.store
      .select((store) => store.maps)
      .subscribe((mapState) => {
        this.rideDriver = mapState.rideDriver;
        this.passengerState = mapState.passengerState;
        this.handlePassengerStatusChange();
      });
    this.setFastestRouteAsPreferred();
    this.drawRouteOnChange();
  }

  handlePassengerStatusChange() {
    if (this.passengerState == PassengerState.RIDING) {
      this.removeLocationIfExists('pickupLocation');
    }

    if (this.passengerState == PassengerState.RIDE_FINISH) {
      this.locationsVectorSource.clear();
      this.routesVectorSource.clear();
      this.drivingRouteVectorSource.clear();
      this.availableRoutes.clear();
      this.updateMapVehicleLayer();
    }
  }

  locationsVectorOnChangeCallback = () => {
    let features = this.locationsVectorSource.getFeatures();
    this.routesVectorSource.clear();
    if (features.length > 1 && this.passengerState !== PassengerState.RIDING) {
      for (let i = 1; i < features.length; i++) {
        let locations: [longitude: number, latitude: number][] = [];
        let start: Location = features[i - 1].get('location');
        let destination: Location = features[i].get('location');
        locations.push([start.longitude, start.latitude]);
        locations.push([destination.longitude, destination.latitude]);
        this.store.dispatch(
          new MapActions.LoadAvailableRoutesForTwoPoints({
            coordinates: locations,
            destinationId: features[i].getId().toString(),
          })
        );
      }
    }
  };

  private setFastestRouteAsPreferred() {
    this.availableRoutes$.subscribe(async (routesMap) => {
      this.availableRoutes = routesMap;
      this.selectedRoute$.pipe(take(1)).subscribe((selectedRouteMap) => {
        for (let key of routesMap.keys()) {
          if (!selectedRouteMap.has(key)) {
            this.store.dispatch(
              new MapActions.SetSelectedRouteCoordinates({
                key: key,
                route: routesMap.get(key)[0],
              })
            );
          }
        }
      });
    });
  }

  private drawRouteOnChange() {
    this.selectedRoute$.pipe().subscribe((routesMap) => {
      if (this.passengerState == PassengerState.FORM_FILL) {
        this.routesVectorSource.clear();
        for (let key of routesMap.keys()) {
          const routeFeature = this.getRouteFeature(
            routesMap.get(key),
            key,
            '#4A89F3',
            6,
            200
          );
          this.routesVectorSource.addFeature(routeFeature);
          const routeFeatureBackground = this.getRouteFeature(
            routesMap.get(key),
            key.concat('bg'),
            '#002E6E',
            10,
            100
          );
          this.routesVectorSource.addFeature(routeFeatureBackground);
        }
      }
    });
  }

  private getRouteFeature(
    routeGeometry: [longitude: number, latitude: number][],
    key: string,
    color: string,
    width: number,
    zIndex: number
  ) {
    let style = new Style({
      stroke: new Stroke({ color: color, width: width }),
      zIndex: zIndex,
    });
    let route = new LineString(routeGeometry).transform(
      'EPSG:4326',
      'EPSG:3857'
    );
    const routeFeature = new Feature({
      type: 'route',
      geometry: route,
    });
    routeFeature.setProperties({ route: routeGeometry });
    routeFeature.setId(key);
    routeFeature.setStyle(style);
    return routeFeature;
  }

  private redrawRouteDuringRide(updatedCurrentPosition: Coordinate) {
    this.selectedRoute$.pipe(take(1)).subscribe((selectedRoutesMap) => {
      if (this.passengerState == PassengerState.RIDING) {
        let routeArray = [];
        for (let value in selectedRoutesMap.values()[0]) {
        }
        selectedRoutesMap.forEach((value) => {
          routeArray.push(...value);
        });
        let currentPositionIndex = routeArray.findIndex(
          (location) =>
            location[0] == updatedCurrentPosition[0] &&
            location[1] == updatedCurrentPosition[1]
        );
        let firstMapValues = selectedRoutesMap.entries().next().value;
        if (
          routeArray[currentPositionIndex] == firstMapValues[1].slice(-1)[0]
        ) {
          this.store.dispatch(
            new MapActions.RemoveCoordinatesForDestination({
              key: firstMapValues[0],
            })
          );
        }
        let routeSubArray = routeArray.slice(
          currentPositionIndex,
          routeArray.length
        );
        const routeFeature = this.getRouteFeature(
          routeSubArray,
          currentPositionIndex.toString(),
          '#4A89F3',
          6,
          200
        );
        const routeFeatureBackground = this.getRouteFeature(
          routeSubArray,
          currentPositionIndex.toString().concat('bg'),
          '#002E6E',
          10,
          100
        );
        this.drivingRouteVectorSource.clear();
        this.drivingRouteVectorSource.addFeature(routeFeature);
        this.drivingRouteVectorSource.addFeature(routeFeatureBackground);
      }
    });
  }

  ngOnDestroy(): void {
    this.mapsSubscription.unsubscribe();
    this.driversSubscription.unsubscribe();
  }
  drawLocation(location: Location, id: string, icon: string) {
    this.removeLocationIfExists(id);
    let marker = new Feature({
      geometry: new Point(fromLonLat([location.longitude, location.latitude])),
      location: location,
    });
    marker.setId(id);
    marker.setStyle(this.getMarkerStyle(icon));
    this.locationsVectorSource.addFeature(marker);
    this.locationsVectorSource.changed();
  }

  public removeLocationIfExists(id: string) {
    if (this.locationsVectorSource.getFeatureById(id)) {
      this.locationsVectorSource.removeFeature(
        this.locationsVectorSource.getFeatureById(id)
      );
      this.store.dispatch(
        new MapActions.RemoveCoordinatesForDestination({ key: id })
      );
    }
  }

  private getMarkerStyle(src: string) {
    return new Style({
      image: new Icon({
        anchor: [0.5, 200],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        opacity: 1,
        src: src,
        scale: 0.07,
      }),
    });
  }

  initMap() {
    return MapUtils.creatInitialMap([19.839388, 45.247744]);
  }

  setTarget(id: string) {
    this.mapSource.value.setTarget(id);
  }

  addOverlay(overlay: Overlay) {
    this.mapSource.value.addOverlay(overlay);
  }

  subscribeToDriversStore() {
    this.driversSubscription = this.store
      .select('drivers')
      .subscribe((driversState) => {
        this.driversInArea = driversState.drivers;
        this.vehicles = this.getVehiclesFromDrivers(driversState.drivers);
        this.error = driversState.error;
        this.updateMapVehicleLayer();
        this.updateOverlay();
      });
  }

  addMapEvents() {
    this.mapSource.value.on('loadstart', () => {
      this.store.dispatch(new MapActions.MapLoadStart());
    });
    this.mapSource.value.on('loadend', (event: any) => {
      this.store.dispatch(
        new MapActions.MapLoadEnd(MapUtils.getMapData(event.map))
      );
    });
    this.mapSource.value.on('click', (event) => {
      const feature = this.mapSource.value.forEachFeatureAtPixel(
        event.pixel,
        function (feature) {
          return feature;
        }
      );
      if (feature && feature.get('type') == 'route') {
        let featureId = feature.getId();
        let selectedRoute = feature.getProperties()['route'];
        let availableRoutes = this.availableRoutes.get(featureId.toString());
        let selectedRouteIndex = availableRoutes.indexOf(selectedRoute);
        let nextRoute =
          selectedRouteIndex < availableRoutes.length - 1
            ? availableRoutes[selectedRouteIndex + 1]
            : availableRoutes[0];
        this.routesVectorSource.removeFeature(
          this.routesVectorSource.getFeatureById(feature.getId())
        );
        this.routesVectorSource.removeFeature(
          this.routesVectorSource.getFeatureById(
            featureId.toString().concat('bg')
          )
        );
        const routeFeature = this.getRouteFeature(
          nextRoute,
          featureId.toString(),
          '#4A89F3',
          6,
          200
        );
        this.store.dispatch(
          new MapActions.SetSelectedRouteCoordinates({
            key: featureId.toString(),
            route: nextRoute,
          })
        );
        const routeFeatureBackground = this.getRouteFeature(
          nextRoute,
          featureId.toString().concat('bg'),
          '#002E6E',
          10,
          100
        );
        this.routesVectorSource.addFeature(routeFeatureBackground);
        this.routesVectorSource.addFeature(routeFeature);
      }
    });
    this.mapSource.value.on('pointermove', (event) => {
      const feature = this.mapSource.value.forEachFeatureAtPixel(
        event.pixel,
        function (feature) {
          return feature;
        }
      );
      if (
        feature &&
        this.vehiclesVectorSource.getFeatureById(feature.getId()) &&
        !feature.get('type')
      ) {
        this.store.dispatch(
          new MapActions.DriverSelected(this.driversInArea[feature.get('id')])
        );
        const geometry = feature.getGeometry();
        const extent = geometry.getExtent();
        const coordinate = [
          (extent[0] + extent[2]) / 2,
          (extent[1] + extent[3]) / 2,
        ];
        this.mapSource.value.getOverlayById('drivers').setPosition(coordinate);
      } else {
        this.updateOverlay();
      }
    });
  }

  updateMapVehicleLayer() {
    this.vehiclesVectorSource.clear();
    if (this.passengerState === PassengerState.RIDING) {
      this.routesVectorSource.clear();
      let riderVehicle = this.vehicles.find(
        (vehicle) => vehicle.id === this.rideDriver.vehicle.id
      );
      this.vehiclesVectorSource.addFeatures(
        MapUtils.createVehicleFeatures([riderVehicle])
      );
      this.redrawRouteDuringRide(riderVehicle.location);
    } else {
      this.vehiclesVectorSource.addFeatures(
        MapUtils.createVehicleFeatures(this.vehicles)
      );
    }
    this.mapSource.value.getOverlayById('drivers')?.setPosition(undefined);
  }

  getVehiclesFromDrivers(drivers: Driver[]): Vehicle[] {
    let vehicles: Vehicle[] = [];
    for (let driver of drivers) {
      vehicles.push(driver.vehicle);
    }
    return vehicles;
  }

  updateOverlay() {
    if (!this.chosenDriverInfo) {
      this.mapSource.value?.getOverlayById('drivers')?.setPosition(undefined);
    }
  }

  recenterToUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          this.mapSource.value
            .getView()
            .setCenter(
              fromLonLat([position.coords.longitude, position.coords.latitude])
            );
        }
      );
    }
  }
}
