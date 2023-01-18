import { Feature, Map, Overlay } from 'ol';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as MapActions from './store/maps.actions';
import * as MapUtils from './mapUtils';
import { Driver } from '../shared/driver.model';
import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, Observable, Subscription } from 'rxjs';
import { Vehicle } from '../shared/vehicle.model';
import VectorSource from 'ol/source/Vector';
import { LineString, Point } from 'ol/geom';
import { fromLonLat } from 'ol/proj';
import { Icon, Style } from 'ol/style';
import { Location } from './model/location';
import { PassengerState } from './model/passengerState';
import { Coordinate } from 'ol/coordinate';

@Injectable()
export class MapsService {
  private mapSource = new BehaviorSubject<Map>(this.initMap());
  map = this.mapSource.asObservable();
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
  route$: Observable<[longitude: number, latitude: number][]>;

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
    this.route$ = this.store.select((store) => store.maps.route);
    this.store
      .select((store) => store.maps)
      .subscribe((mapState) => {
        this.rideDriver = mapState.rideDriver;
        this.passengerState = mapState.passengerState;
        this.handlePassengerStatusChange();
      });
    this.drawRouteOnChange();
  }

  handlePassengerStatusChange() {
    if (this.passengerState == PassengerState.RIDING) {
      this.removeLocationIfExists('pickupLocation');
    }

    if (this.passengerState == PassengerState.RIDE_FINISH) {
      this.removeLocationIfExists('destination');
      this.locationsVectorSource.clear();
      this.routesVectorSource.clear();
      this.updateMapVehicleLayer();
    }
  }

  locationsVectorOnChangeCallback = () => {
    let features = this.locationsVectorSource.getFeatures();
    let locations: [longitude: number, latitude: number][] = [];
    this.routesVectorSource.clear();
    if (features.length > 1) {
      features.forEach((feature) => {
        let location: Location = feature.get('location');
        locations.push([location.longitude, location.latitude]);
      });
      this.store.dispatch(
        new MapActions.LoadDirectionCoordinates({ coordinates: locations })
      );
    }
  };

  private drawRouteOnChange() {
    this.route$
      .pipe(filter((routeArray) => routeArray.length > 1))
      .subscribe((routeArray) => {
        let route = new LineString(routeArray).transform(
          'EPSG:4326',
          'EPSG:3857'
        );
        const routeFeature = new Feature({
          type: 'route',
          geometry: route,
        });
        this.routesVectorSource.addFeature(routeFeature);
      });
  }

  private redrawRouteDuringRide(updatedCurrentPosition: Coordinate) {
    this.drivingRouteVectorSource.clear();
    this.route$
      .pipe(filter((routeArray) => routeArray.length > 1))
      .subscribe((routeArray) => {
        let currentPositionIndex = routeArray.findIndex(
          (location) =>
            location[0] == updatedCurrentPosition[0] &&
            location[1] == updatedCurrentPosition[1]
        );
        let routeSubArray = routeArray.slice(
          currentPositionIndex,
          routeArray.length
        );
        let route = new LineString(routeSubArray).transform(
          'EPSG:4326',
          'EPSG:3857'
        );
        const routeFeature = new Feature({
          type: 'route',
          geometry: route,
        });
        this.drivingRouteVectorSource.addFeature(routeFeature);
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

  private removeLocationIfExists(id: string) {
    if (this.locationsVectorSource.getFeatureById(id)) {
      this.locationsVectorSource.removeFeature(
        this.locationsVectorSource.getFeatureById(id)
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
    this.mapSource.value.on('pointermove', (event) => {
      const feature = this.mapSource.value.forEachFeatureAtPixel(
        event.pixel,
        function (feature) {
          return feature;
        }
      );
      if (feature) {
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
