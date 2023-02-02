import {
  AfterViewInit,
  Component,
  DoCheck,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Map } from 'ol';
import { Observable, Subscription } from 'rxjs';
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
import { MapsService } from '../maps.service';
import { ToastrService } from 'ngx-toastr';
import { RideStatus } from '../model/rideStatus';

@Component({
  selector: 'app-active-drivers-map',
  templateUrl: './active-drivers-map.component.html',
  styleUrls: ['./active-drivers-map.component.scss'],
})
export class ActiveDriversMapComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('popup') popup: ElementRef;
  loading: boolean;
  driver: Driver;
  rideStatus$: Observable<RideStatus>;
  rideStatusEnum: typeof RideStatus = RideStatus;

  constructor(
    private store: Store<fromApp.AppState>,
    private stompService: StompService,
    private mapsService: MapsService,
    private toastr: ToastrService
  ) {}
  
  ngOnDestroy(): void {
    this.mapsService.setTarget(null);
  }

  ngOnInit(): void {
    this.mapsService.setTarget('map');
    this.store.select('maps').subscribe((mapsState) => {
      this.loading = mapsState.loading;
      this.driver = mapsState.chosenDriverInfo;
      this.mapsService.updateMapVehicleLayer();
    });
    this.rideStatus$ = this.store.select(
      (store) => store.maps.rideStatus
    );
    this.subscribeToWebSocket()
  }

  ngAfterViewInit(): void {
    this.mapsService.addOverlay(
      MapUtils.createMapDriversOverlay(this.popup.nativeElement as HTMLElement)
    );
  }

  subscribeToWebSocket() {
    const stompClient = this.stompService.connect();
    stompClient.connect({}, () => {
      stompClient.subscribe('/topic/vehicles', (): any => {
        this.store.dispatch(new DriversActions.FetchActiveDriversInArea());
      });
    });
  }
}
