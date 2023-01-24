import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
} from '@angular/forms';
import {
  async,
  debounceTime,
  distinctUntilChanged,
  filter,
  Observable,
} from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import * as MapActions from '../store/maps.actions';
import { Location } from '../model/location';
import { Map } from 'ol';
import { MapsService } from '../maps.service';
import { PassengerState } from '../model/passengerState';

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
  routeStops: { [key: string]: Location } = {};
  route$: Observable<[longitude: number, latitude: number][]>;
  routeArray: [longitude: number, latitude: number][];
  fillFormState: boolean;
  filterDriversMode = false;

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
    this.route$ = this.store.select((store) => store.maps.route);
    this.route$.subscribe((routeArray) => (this.routeArray = routeArray));
    this.store
      .select((store) => store.maps.passengerState)
      .subscribe((passengerState: PassengerState) => {
        passengerState == PassengerState.FORM_FILL
          ? (this.fillFormState = true)
          : (this.fillFormState = false);
      });
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
        debounceTime(25),
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
        debounceTime(25),
        distinctUntilChanged(),
        filter((value: string) => value.length > 0)
      )
      .subscribe((value: string) => {
        this.store.dispatch(
          new MapActions.LoadPickupLocationAutocompleteResults({ value: value })
        );
      });
  }

  onSubmit(formDirective: FormGroupDirective) {
    formDirective.resetForm();
    this.ridingForm.reset();
    this.store.dispatch(
      new MapActions.SearchForDriver({
        clientLocation: this.routeStops['start'],
        route: this.routeArray,
      })
    );

    this.routeStops = {};
  }

  onSubmit2() {
    this.filterDriversMode = true;
  }

  markPickupLocation(location: Location) {
    this.routeStops['start'] = location;
    this.mapsService.drawLocation(
      location,
      'pickupLocation',
      '../assets/pickup.png'
    );
  }
  markDestination(location: Location) {
    this.routeStops['end'] = location;
    this.mapsService.drawLocation(location, 'destination', '../assets/pin.png');
  }
}
