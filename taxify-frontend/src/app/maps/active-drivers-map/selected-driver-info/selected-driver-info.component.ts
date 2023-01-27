import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from '../../../store/app.reducer';
import * as MapsActions from '../../store/maps.actions';
import { Driver } from '../../../shared/model/driver.model';

@Component({
  selector: 'app-selected-driver-info',
  templateUrl: './selected-driver-info.component.html',
  styleUrls: ['./selected-driver-info.component.scss'],
})
export class SelectedDriverInfoComponent implements OnInit {
  driver: Driver;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit(): void {
    this.store.select('maps').subscribe((mapsState) => {
      this.driver = mapsState.driver;
    });
  }

  closePopup() {
    this.store.dispatch(new MapsActions.PopupClose());
  }
}
