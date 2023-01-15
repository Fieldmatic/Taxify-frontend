import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  tap,
} from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import * as MapActions from '../store/maps.actions';
import { Location } from '../model/location';
import { Map } from 'ol';
import { getMarker } from '../mapUtils';
import { MapsService } from '../maps.service';

@Component({
  selector: 'app-passenger-map-form',
  templateUrl: './passenger-map-form.component.html',
  styleUrls: ['./passenger-map-form.component.scss'],
})
export class PassengerMapFormComponent implements OnInit {
  ridingForm!: FormGroup;
  pickupLocationAddresses$: Observable<Array<Location>>;
  destinationAddresses$: Observable<Array<Location>>;
  map: Map;
  pinIds = [];

  constructor(
    private formBuilder: FormBuilder,
    private store: Store<fromApp.AppState>,
    private mapsService: MapsService
  ) {}

  ngOnInit(): void {
    this.selectStoreStates();
    this.initForm();
    this.initPickupLocationsAutocompleteOnChange();
    this.initDestinationAutocompleteOnChange();
  }

  private selectStoreStates() {
    this.pickupLocationAddresses$ = this.store.select(
      (store) => store.maps.pickupLocations
    );
    this.destinationAddresses$ = this.store.select(
      (store) => store.maps.destinations
    );
  }

  private initForm() {
    this.ridingForm = this.formBuilder.group({
      pickupLocation: new FormControl(''),
      destination: new FormControl(''),
    });
  }

  private initDestinationAutocompleteOnChange() {
    this.ridingForm.controls['destination'].valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        filter((value: string) => value.length > 0)
      )
      .subscribe((value: string) => {
        this.store.dispatch(
          new MapActions.LoadDestinationAutocompleteResults({ value: value })
        );
      });
  }

  private initPickupLocationsAutocompleteOnChange() {
    this.ridingForm.controls['pickupLocation'].valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        filter((value: string) => value.length > 0)
      )
      .subscribe((value: string) => {
        this.store.dispatch(
          new MapActions.LoadPickupLocationAutocompleteResults({ value: value })
        );
      });
  }

  markPickupLocation(location: Location) {
    this.mapsService.drawLocation(
      location,
      'pickupLocation',
      '../assets/pickup.png'
    );
  }
  markDestination(location: Location) {
    this.mapsService.drawLocation(location, 'destination', '../assets/pin.png');
  }
}
