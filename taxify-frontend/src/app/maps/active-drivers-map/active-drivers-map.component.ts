import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
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
export class ActiveDriversMapComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  map: Map;
  drivers: Driver[] = [];
  vehicles: Vehicle[] = [];
  error: number;
  loading: boolean;
  mapsSubscription: Subscription;
  driversSubscription: Subscription;
  driver: Driver;
  @ViewChild('popup') popup: ElementRef;

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
    this.addMapEvents();
  }

  ngAfterViewInit(): void {
    this.map.addOverlay(
      MapUtils.createMapDriversOverlay(this.popup.nativeElement as HTMLElement)
    );
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
        this.updateOverlay();
      });
  }

  subscribeToMapsStore() {
    this.mapsSubscription = this.store.select('maps').subscribe((mapsState) => {
      this.loading = mapsState.loading;
      this.driver = mapsState.driver;
      if (this.map) {
        this.updateMapVehicleLayer();
      } else {
        this.initMap(mapsState.mapData.mapCenter);
      }
    });
  }

  addMapEvents() {
    this.map.on('loadstart', () => {
      this.store.dispatch(new MapActions.MapLoadStart());
    });
    this.map.on('loadend', (event: any) => {
      this.store.dispatch(
        new MapActions.MapLoadEnd(MapUtils.getMapData(event.map))
      );
    });
    this.map.on('click', (event) => {
      const feature = this.map.forEachFeatureAtPixel(
        event.pixel,
        function (feature) {
          return feature;
        }
      );
      if (feature) {
        this.store.dispatch(
          new MapActions.DriverSelected(this.drivers[feature.get('id')])
        );
        const geometry = feature.getGeometry();
        const extent = geometry.getExtent();
        const coordinate = [
          (extent[0] + extent[2]) / 2,
          (extent[1] + extent[3]) / 2,
        ];
        this.map.getOverlayById('drivers').setPosition(coordinate);
      }
    });
  }

  initMap(mapCenter: Coordinate) {
    this.map = MapUtils.createMapWithVehiclesLayer(mapCenter, this.vehicles);
  }

  updateMapVehicleLayer() {
    if (this.map) {
      let vectorSource = <VectorSource>this.map.getAllLayers()[1].getSource();
      vectorSource.clear();
      vectorSource.addFeatures(MapUtils.createVehicleFeatures(this.vehicles));
      vectorSource.changed();
      this.map.getOverlayById('drivers').setPosition(undefined);
    }
  }

  getVehiclesFromDrivers(drivers: Driver[]): Vehicle[] {
    let vehicles: Vehicle[] = [];
    for (let driver of drivers) {
      vehicles.push(driver.vehicle);
    }
    return vehicles;
  }

  updateOverlay() {
    if (!this.driver) {
      this.map?.getOverlayById('drivers').setPosition(undefined);
    }
  }
}
