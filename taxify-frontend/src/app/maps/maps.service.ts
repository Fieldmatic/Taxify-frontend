import { Feature, Overlay } from 'ol';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as MapActions from './store/maps.actions';
import * as MapUtils from './mapUtils';
import { Driver } from '../shared/driver.model';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, Subscription, take } from 'rxjs';
import { Vehicle } from '../shared/vehicle.model';
import VectorSource from 'ol/source/Vector';
import { LineString, Point } from 'ol/geom';
import { fromLonLat } from 'ol/proj';
import { Icon, Stroke, Style } from 'ol/style';
import { Location } from './model/location';
import { RideStatus } from './model/rideStatus';
import { Coordinate } from 'ol/coordinate';
import OLMap from 'ol/Map';
import { Route } from './model/route';
import { LoggedInUser } from '../auth/model/logged-in-user';
import { DriverState } from '../drivers/model/driverState';

@Injectable()
export class MapsService {
  private mapSource = new BehaviorSubject<OLMap>(this.initMap());
  map = this.mapSource.asObservable();
  driversInArea: Driver[] = [];
  driversSubscription: Subscription;
  mapsSubscription: Subscription;
  vehicles: Vehicle[] = [];
  error: number;
  chosenDriverInfo: Driver;
  rideDriver: Driver;
  rideStatus: RideStatus;
  driverState: DriverState;
  locationsVectorSource: VectorSource;
  routesVectorSource: VectorSource;
  drivingRouteVectorSource: VectorSource;
  vehiclesVectorSource: VectorSource;
  selectedRoute$: Observable<Map<string, Route>>;
  availableRoutes$: Observable<Map<string, Route[]>>;
  clientStartLocation: [longitude: number, latitude: number];
  currentDriverLocation: [longitude: number, latitude: number] = null;

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
    this.selectedRoute$ = this.store.select(
      (store) => store.maps.selectedRoute
    );
    this.availableRoutes$ = this.store.select(
      (store) => store.maps.availableRoutes
    );
    this.store
      .select((store) => store.maps.rideDriver)
      .subscribe((driver) => {
        this.rideDriver = driver;
        this.addMarkers()
      });
    this.store
      .select((store) => store.maps.rideStatus)
      .subscribe((rideStatus) => {
        this.rideStatus = rideStatus;
        this.handlePassengerStatusChange();
      });
    this.store.select((store) => store.drivers.driverState).subscribe((driverState) => {
      this.driverState = driverState;
    })
    this.drawRouteOnChange();
  }

  loadActiveRide() {
      this.store.dispatch(new MapActions.LoadActiveRoute())
  }

  handlePassengerStatusChange() {
    if (this.rideStatus == RideStatus.RIDING) {
      this.removeLocationIfExists('location0');
    }

    if (this.rideStatus == RideStatus.RIDE_FINISH) {
      this.locationsVectorSource.clear();
      this.routesVectorSource.clear();
      this.drivingRouteVectorSource.clear();
      this.updateMapVehicleLayer();
    }
  }

  reloadAvailableRoutes() {
    let features = this.locationsVectorSource.getFeatures();
    features.sort((a, b) =>
      a.getId() > b.getId() ? 1 : b.getId() > a.getId() ? -1 : 0
    );
    this.routesVectorSource.clear();
    if (features.length > 1 && this.rideStatus !== RideStatus.RIDING) {
      for (let i = 1; i < features.length; i++) {
        let locations: [longitude: number, latitude: number][] = [];
        let start: Location = features[i - 1].get('location');
        let destination: Location = features[i].get('location');
        locations.push([start.longitude, start.latitude]);
        locations.push([destination.longitude, destination.latitude]);
        let payload = {
          coordinates: locations,
          destinationId: features[i].getId().toString(),
        };
        this.store.dispatch(
          new MapActions.LoadAvailableRoutesForTwoPoints(payload)
        );
      }
    }
  }

  private drawRouteOnChange() {
    this.selectedRoute$.pipe().subscribe((routesMap) => {
      let sortedMap = new Map([...routesMap].sort());
      if (this.rideStatus === RideStatus.FORM_FILL){
        this.routesVectorSource.clear();
        for (let key of sortedMap.keys()) {
          const routeFeature = this.getRouteFeature(
            sortedMap.get(key),
            key,
            '#4A89F3',
            4,
            200
          );
          this.routesVectorSource.addFeature(routeFeature);
          const routeFeatureBackground = this.getRouteFeature(
            sortedMap.get(key),
            key.concat('bg'),
            '#002E6E',
            6,
            100
          );
          this.routesVectorSource.addFeature(routeFeatureBackground);
        }
      }});
  }

  private getRouteFeature(
    selectedRoute: Route,
    key: string,
    color: string,
    width: number,
    zIndex: number
  ) {
    let style = new Style({
      stroke: new Stroke({ color: color, width: width }),
      zIndex: zIndex,
    });
    let route = new LineString(selectedRoute.route.map((route) => {return [route[0], route[1]]})).transform(
      'EPSG:4326',
      'EPSG:3857'
    );
    const routeFeature = new Feature({
      type: 'route',
      geometry: route,
    });
    routeFeature.setProperties({ route: selectedRoute });
    routeFeature.setId(key);
    routeFeature.setStyle(style);
    return routeFeature;
  }

  private redrawRouteDuringRide(updatedCurrentPosition: Coordinate) {
    this.selectedRoute$?.pipe(take(1)).subscribe((selectedRoutesMap) => {
      let sortedMap = new Map([...selectedRoutesMap].sort());
      if (this.rideStatus == RideStatus.RIDING || this.driverState == DriverState.RIDE_START && sortedMap.size > 0) {
        this.routesVectorSource.clear()
        let routeArray = [];
        let duration = 0;
        let distance = 0;
        sortedMap.forEach((value) => {
          routeArray.push(...value.route);
          duration += value.duration;
          distance += value.distance;
        });
        this.recenterToLocation(
          updatedCurrentPosition[0],
          updatedCurrentPosition[1]
        );
        let currentPositionIndex = routeArray.findIndex(
          (location) =>
            location[0] == updatedCurrentPosition[0] &&
            location[1] == updatedCurrentPosition[1]
        );
        let firstMapValues = sortedMap.entries().next().value;
        if (firstMapValues && currentPositionIndex == firstMapValues[1]['route'].length - 1) {
          this.store.dispatch(
            new MapActions.RemoveCoordinatesForDestination({
              key: firstMapValues[0],
            })
          );
          this.removeLocationIfExists(firstMapValues[0])
        }
        let routeSubArray = routeArray.slice(
          currentPositionIndex,
          routeArray.length
        );
        let subDuration = duration - currentPositionIndex * 15;
        const routeFeature = this.getRouteFeature(
          new Route( routeSubArray, distance, subDuration),
          currentPositionIndex.toString(),
          '#4A89F3',
          4,
          200
        );
        const routeFeatureBackground = this.getRouteFeature(
          new Route( routeSubArray, distance, subDuration),
          currentPositionIndex.toString().concat('bg'),
          '#002E6E',
          6,
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

  addMarkers() {
    this.selectedRoute$?.pipe(take(1)).subscribe((selectedRoutesMap) => {
      console.log(selectedRoutesMap)
      let sortedMap = new Map([...selectedRoutesMap].sort());
        this.routesVectorSource.clear();
        for (let key of sortedMap.keys()) {
          if (key === 'location1') this.drawLocation(new Location(sortedMap.get(key).route[0][1], sortedMap.get(key).route[0][0]), 'location0',  '../assets/pickup.png');
          this.drawLocation(new Location(sortedMap.get(key).route[sortedMap.get(key).route.length-1][1], sortedMap.get(key).route[sortedMap.get(key).route.length-1][0]), key,'../assets/pin.png');
          const routeFeature = this.getRouteFeature(
            sortedMap.get(key),
            key,
            '#4A89F3',
            4,
            200
          );
          this.routesVectorSource.addFeature(routeFeature);
          const routeFeatureBackground = this.getRouteFeature(
            sortedMap.get(key),
            key.concat('bg'),
            '#002E6E',
            6,
            100
          );
          this.routesVectorSource.addFeature(routeFeatureBackground);
        }
    });
  }
  drawLocation(location: Location, id: string, icon: string) {
    this.removeLocationIfExists(id);
    if (id === 'location0')
      this.clientStartLocation = [location.longitude, location.latitude];
    let marker = new Feature({
      geometry: new Point(fromLonLat([location.longitude, location.latitude])),
      location: location,
    });
    marker.setId(id);
    marker.setStyle(this.getMarkerStyle(icon));
    this.locationsVectorSource.addFeature(marker);
    this.reloadAvailableRoutes();
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
      let featureId: string = feature.getId().toString();
      if (feature && featureId.includes('location') && !featureId.includes('bg') && this.rideStatus == RideStatus.FORM_FILL) {
        this.availableRoutes$.pipe(take(1)).subscribe((availableRoutes) => {
          let featureId = feature.getId();
          let selectedRoute = feature.getProperties()['route'];
          let destinationAvailableRoutes = availableRoutes.get(
            featureId.toString()
          );
          let selectedRouteIndex =
            destinationAvailableRoutes.indexOf(selectedRoute);
          let nextRoute =
            selectedRouteIndex < destinationAvailableRoutes.length - 1
              ? destinationAvailableRoutes[selectedRouteIndex + 1]
              : destinationAvailableRoutes[0];
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
          const routeFeatureBackground = this.getRouteFeature(
            nextRoute,
            featureId.toString().concat('bg'),
            '#002E6E',
            10,
            100
          );
          this.routesVectorSource.addFeature(routeFeatureBackground);
          this.routesVectorSource.addFeature(routeFeature);
          this.store.dispatch(
            new MapActions.SetSelectedRouteCoordinates({
              key: featureId.toString(),
              route: nextRoute,
            })
          );
        });
      }
    });

    this.mapSource.value.on('pointermove', (event) => {
      const feature = this.mapSource.value.forEachFeatureAtPixel(
        event.pixel,
        function (feature) {
          return feature;
        }
      );
      let featureId = feature?.getId().toString();
      event.map.getTargetElement().style.cursor =
        feature && !featureId.includes('bg') ? 'pointer' : '';
      if (
        feature &&
        this.vehiclesVectorSource.getFeatureById(feature.getId()) &&
        !feature.get('type')
      ) {
        event.map.getTargetElement().style.cursor = 'pointer';
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
    if (this.rideStatus === RideStatus.RIDING || this.driverState === DriverState.RIDE_START && this.vehicles.length > 0) {
      console.log("voznja")
      console.log(this.rideDriver)
      this.routesVectorSource.clear();
      console.log(this.vehicles)
      let riderVehicle = this.vehicles.find(
        (vehicle) => vehicle.id === this.rideDriver.vehicle.id
      );
      this.vehiclesVectorSource.addFeatures(
        MapUtils.createVehicleFeatures([riderVehicle])
      );
      this.redrawRouteDuringRide(riderVehicle.location);
    }
    else if (this.rideStatus === RideStatus.WAITING_FOR_DRIVER_TO_ARRIVE && this.vehicles.length > 0) {
      console.log("cekanje")
      console.log(this.rideDriver)
      console.log(this.vehicles)
      let riderVehicle: Vehicle = this.vehicles.find(
        (vehicle) => vehicle.id === this.rideDriver.vehicle.id
      );
      this.vehiclesVectorSource.addFeatures(
        MapUtils.createVehicleFeatures([riderVehicle])
      );
      let driverLocation: [longitude: number, latitude: number] = [
        riderVehicle.location[0],
        riderVehicle.location[1],
      ];
      if (this.currentDriverLocation == null) {
        this.currentDriverLocation = driverLocation;
        this.recenterToLocation(driverLocation[0], driverLocation[1]);
        this.store.dispatch(
          new MapActions.LoadTimeFromDriverToClient({
            coordinates: [
              this.currentDriverLocation,
              this.clientStartLocation,
            ],
          })
        );
      }
      if (
        driverLocation[0] !== this.currentDriverLocation[0] &&
        driverLocation[1] !== this.currentDriverLocation[1]
      ) {
        this.recenterToLocation(driverLocation[0], driverLocation[1]);
        this.currentDriverLocation = driverLocation;
        this.store.dispatch(new MapActions.SubtractTimeLeft({ value: 1 }));
      }
    }
    else {
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
  recenterToLocation(longitude, latitude) {
    this.mapSource.value.getView().setCenter(fromLonLat([longitude, latitude]));
  }
}
