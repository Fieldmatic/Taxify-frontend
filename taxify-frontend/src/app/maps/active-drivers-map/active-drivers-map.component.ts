import { Component, OnDestroy, OnInit } from '@angular/core';
import { Map } from 'ol';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { Driver } from '../../shared/driver.model';
import { StompService } from '../../stomp.service';
import * as fromApp from '../../store/app.reducer';
import * as MapActions from '../store/maps.actions';
import * as DriversActions from '../../drivers/store/drivers.actions';
import { Coordinate } from 'ol/coordinate';
import * as MapUtils from '../mapUtils';
import VectorSource from 'ol/source/Vector';
import { Vehicle } from '../../shared/vehicle.model';

@Component({
  selector: 'app-active-drivers-map',
  templateUrl: './active-drivers-map.component.html',
  styleUrls: ['./active-drivers-map.component.scss'],
})
export class ActiveDriversMapComponent implements OnInit, OnDestroy {
  map: Map;
  drivers: Driver[] = [];
  vehicles: Vehicle[] = [];
  error: number;
  loading: boolean;
  mapsSubscription: Subscription;
  driversSubscription: Subscription;

  constructor(
    private store: Store<fromApp.AppState>,
    private stompService: StompService
  ) {}

  ngOnDestroy(): void {
    this.mapsSubscription.unsubscribe();
    this.driversSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.subscribeToWebSocket();
    this.subscribeToDriversStore();
    this.subscribeToMapsStore();
    this.addMapLoadEvents();
  }

  subscribeToWebSocket() {
    this.stompService.subscribe('/topic/vehicles', (): any => {
      this.store.dispatch(new DriversActions.FetchActiveDriversInArea());
    });
  }

  subscribeToDriversStore() {
    this.driversSubscription = this.store
      .select('drivers')
      .subscribe((driversState) => {
        this.drivers = driversState.drivers;
        this.vehicles = this.getVehiclesFromDrivers(driversState.drivers);
        this.error = driversState.error;
        this.updateMapVehicleLayer();
      });
  }

  subscribeToMapsStore() {
    this.mapsSubscription = this.store.select('maps').subscribe((mapsState) => {
      this.loading = mapsState.loading;
      if (this.map) {
        this.updateMapVehicleLayer();
      } else {
        this.initMap(mapsState.mapData.mapCenter);
      }
    });
  }

  addMapLoadEvents() {
    this.map.on('loadstart', () => {
      this.store.dispatch(new MapActions.MapLoadStart());
    });
    this.map.on('loadend', (event: any) => {
      this.store.dispatch(
        new MapActions.MapLoadEnd(MapUtils.getMapData(event.map))
      );
    });
  }

  initMap(mapCenter: Coordinate) {
    this.map = MapUtils.createMapWithVehiclesLayer(mapCenter, this.vehicles);
  }

  updateMapVehicleLayer() {
    let vectorSource = <VectorSource>this.map.getAllLayers()[1].getSource();
    vectorSource.clear();
    vectorSource.addFeatures(MapUtils.createVehicleFeatures(this.vehicles));
    vectorSource.changed();
  }

  getVehiclesFromDrivers(drivers: Driver[]): Vehicle[] {
    let vehicles: Vehicle[] = [];
    for (let driver of drivers) {
      vehicles.push(driver.vehicle);
    }
    return vehicles;
  }
}
