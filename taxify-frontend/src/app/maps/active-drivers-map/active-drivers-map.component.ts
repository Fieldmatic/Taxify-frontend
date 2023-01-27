import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Driver } from '../../shared/model/driver.model';
import { StompService } from '../../stomp.service';
import * as fromApp from '../../store/app.reducer';
import * as DriversActions from '../../drivers/store/drivers.actions';
import * as MapUtils from '../mapUtils';
import { MapsService } from '../maps.service';

@Component({
  selector: 'app-active-drivers-map',
  templateUrl: './active-drivers-map.component.html',
  styleUrls: ['./active-drivers-map.component.scss'],
})
export class ActiveDriversMapComponent implements OnInit, AfterViewInit {
  @ViewChild('popup') popup: ElementRef;
  loading: boolean;
  driver: Driver;

  constructor(
    private store: Store<fromApp.AppState>,
    private stompService: StompService,
    private mapsService: MapsService
  ) {}

  ngOnInit(): void {
    this.subscribeToWebSocket();
    this.store.select('maps').subscribe((mapsState) => {
      this.loading = mapsState.loading;
      this.driver = mapsState.driver;
    });
    this.mapsService.setTarget('map');
  }

  ngAfterViewInit(): void {
    this.mapsService.addOverlay(
      MapUtils.createMapDriversOverlay(this.popup.nativeElement as HTMLElement)
    );
  }

  subscribeToWebSocket() {
    this.stompService.subscribe('/topic/vehicles', (): any => {
      this.store.dispatch(new DriversActions.FetchActiveDriversInArea());
    });
  }
}
