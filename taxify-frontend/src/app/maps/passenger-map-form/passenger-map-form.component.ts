import { Component, OnInit } from '@angular/core';
import {
  FormArray,
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
import OLMap from 'ol/Map';

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
  //route$: Observable<[longitude: number, latitude: number][]>;
  fillFormState: boolean;
  filterDriversMode = false;
  map: OLMap;
  routeStops: Map<string, Location> = new Map<string, Location>();

  routeArray: [longitude: number, latitude: number][] = [];

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
    this.store
      .select((store) => store.maps.selectedRoute)
      .subscribe((selectedRouteMap) => {
        this.routeArray = [];
        selectedRouteMap.forEach((value) => {
          this.routeArray.push(...value);
        });
      });
  }

  public additionalDestinations(): FormArray {
    return this.ridingForm.get('additionalDestinations') as FormArray;
  }
  public addNewDestination() {
    this.additionalDestinations().push(this.newDestination());
  }

  private newDestination(): FormControl {
    return new FormControl('');
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
      additionalDestinations: this.formBuilder.array([]),
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

  public getAdditionalDestination(i: number) {
    return this.additionalDestinations().at(i) as FormControl;
  }

  public removeAdditionalDestination(i: number) {
    this.additionalDestinations().removeAt(i);
    this.mapsService.removeLocationIfExists(
      'destination'.concat((i + 1).toString())
    );
  }

  public updateDestinations(value: string) {
    this.store.dispatch(
      new MapActions.LoadDestinationAutocompleteResults({ value: value })
    );
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
    this.initForm();
    this.store.dispatch(
      new MapActions.SearchForDriver({
        clientLocation: this.routeStops.get('start'),
        route: this.routeArray,
      })
    );
    this.routeStops.clear();
  }

  onSubmit2() {
    this.filterDriversMode = true;
  }

  markPickupLocation(location: Location) {
    this.routeStops.set('start', location);
    this.mapsService.drawLocation(
      location,
      'pickupLocation',
      '../assets/pickup.png'
    );
  }
  markDestination(location: Location, index: number) {
    let id = 'destination'.concat(index.toString());
    this.routeStops.set(id, location);
    this.mapsService.drawLocation(location, id, '../assets/pin.png');
    this.store.dispatch(new MapActions.ClearDestinationAutocompleteResults());
  }
}
