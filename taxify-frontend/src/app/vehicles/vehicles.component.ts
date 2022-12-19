import { Component, OnDestroy, OnInit } from '@angular/core';
import { Map } from 'ol';
import { Vehicle } from '../shared/vehicle.model';
import { StompService } from '../stomp.service';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { Coordinate } from 'ol/coordinate';
import VectorSource from 'ol/source/Vector';
import * as fromApp from '../store/app.reducer';
import * as VehiclesActions from './store/vehicles.actions';
import * as MapUtils from './mapUtils';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss'],
})
export class VehiclesComponent implements OnInit, OnDestroy {
  map: Map;
  vehicles: Vehicle[] = [];
  error: number;
  loading: boolean;
  vehiclesSubscription: Subscription;

  constructor(
    private store: Store<fromApp.AppState>,
    private stompService: StompService
  ) {}

  ngOnDestroy(): void {
    this.vehiclesSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.stompService.subscribe('/topic/vehicles', (): any => {
      this.store.dispatch(new VehiclesActions.VehiclesChanged());
    });
    this.vehiclesSubscription = this.store
      .select('vehicles')
      .subscribe((vehiclesState) => {
        this.loading = vehiclesState.loading;
        this.vehicles = vehiclesState.vehicles;
        this.error = vehiclesState.error;
        if (this.map) {
          this.updateMapVehicleLayer();
        } else {
          this.initMap(vehiclesState.mapData.mapCenter);
        }
      });
    this.map.on('loadstart', () => {
      this.store.dispatch(new VehiclesActions.MapLoadStart());
    });
    this.map.on('loadend', (event: any) => {
      this.store.dispatch(
        new VehiclesActions.MapLoadEnd(MapUtils.getMapData(event.map))
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
}
