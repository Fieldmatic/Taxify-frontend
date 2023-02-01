import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Driver } from '../../shared/model/driver.model';
import { StompService } from '../../stomp.service';
import * as fromApp from '../../store/app.reducer';
import * as DriversActions from '../../drivers/store/drivers.actions';
import * as MapUtils from '../mapUtils';
import { MapsService } from '../maps.service';
import { ToastrService } from 'ngx-toastr';
import { PassengerState } from '../model/passengerState';

@Component({
  selector: 'app-active-drivers-map',
  templateUrl: './active-drivers-map.component.html',
  styleUrls: ['./active-drivers-map.component.scss'],
})
export class ActiveDriversMapComponent implements OnInit, AfterViewInit {
  @ViewChild('popup') popup: ElementRef;
  loading: boolean;
  driver: Driver;
  passengerState$: Observable<PassengerState>;
  passengerStateEnum: typeof PassengerState = PassengerState;

  constructor(
    private store: Store<fromApp.AppState>,
    private stompService: StompService,
    private mapsService: MapsService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.store.select('maps').subscribe((mapsState) => {
      this.loading = mapsState.loading;
      this.driver = mapsState.chosenDriverInfo;
      this.mapsService.updateMapVehicleLayer();
    });
    this.mapsService.setTarget('map');
    this.passengerState$ = this.store.select(
      (store) => store.maps.passengerState
    );
    this.subscribeToWebSocket();
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
