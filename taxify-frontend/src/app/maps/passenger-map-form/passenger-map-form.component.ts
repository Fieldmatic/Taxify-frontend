import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
} from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import * as MapActions from '../store/maps.actions';
import { Location } from '../model/location';
import OLMap from 'ol/Map';

import { MapsService } from '../maps.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'src/app/shared/services/notifier.service';

@Component({
  selector: 'app-passenger-map-form',
  templateUrl: './passenger-map-form.component.html',
  styleUrls: ['./passenger-map-form.component.scss'],
})
export class PassengerMapFormComponent implements OnInit {
  ridingForm!: FormGroup;
  pickupLocationAddresses$: Observable<Array<Location>>;
  destinationAddresses$: Observable<Array<Location>>;
  routeStops: Map<string, Location> = new Map<string, Location>();
  distance: number;
  duration: number;
  locationNames: string[];

  filterDriversMode = false;

  constructor(
    private formBuilder: FormBuilder,
    private store: Store<fromApp.AppState>,
    private mapsService: MapsService,
    private route: ActivatedRoute,
    private router: Router,
    private notifierService: NotifierService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.filterDriversMode = params['filterDriversMode'];
    });
    this.selectStoreStates();
    this.initForm();
    this.initPickupLocationsAutocompleteOnChange();
    this.initDestinationAutocompleteOnChange();
    this.store
      .select((store) => store.maps.selectedRoute)
      .subscribe((selectedRouteMap) => {
        let sortedMap = new Map([...selectedRouteMap].sort());
        this.distance = 0;
        this.duration = 0;
        sortedMap.forEach((value) => {
          this.distance += value.distance;
          this.duration += value.duration;
        });
        this.locationNames = this.getLocationNameList();
        this.distance = Number((this.distance / 1000).toFixed(2));
        this.duration = Number((this.duration / 60).toFixed(2));
        this.store.dispatch(
          new MapActions.SetRouteDistance({ routeDistance: this.distance })
        );
      });
  }

  public getLocationNameList(): string[] {
    let locationNames: string[] = []
    if (this.ridingForm.getRawValue()['pickupLocation'] != '') locationNames.push(this.ridingForm.getRawValue()['pickupLocation'])
    if (this.ridingForm.getRawValue()['destination'] != '') locationNames.push(this.ridingForm.getRawValue()['destination'])
    for (let i = 0; i< this.additionalDestinations().value.length; i++) {
      locationNames.push(this.additionalDestinations().value[i])
    }
    return locationNames;
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
      'location'.concat((i + 2).toString())
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
    console.log(this.locationNames.length)
    if (this.locationNames.length < 2) {
      this.notifierService.notifyInfo("You cant continue without selecting atleast two places!")
      return;
    }
    this.store.dispatch(new MapActions.SetLocationNames({locationNames: this.locationNames}))
    this.router.navigate(['/maps'],  {
      queryParams: { filterDriversMode: true },
      queryParamsHandling: 'merge' }
    );
    
  }

  markPickupLocation(location: Location) {
    this.routeStops.set('location0', location);
    this.mapsService.drawLocation(
      location,
      'location0',
      '../assets/pickup.png',
      true
    );
  }
  markDestination(location: Location, index: number) {
    let id = 'location'.concat(index.toString());
    this.routeStops.set(id, location);
    this.mapsService.drawLocation(location, id, '../assets/pin.png', true);
    this.store.dispatch(new MapActions.ClearDestinationAutocompleteResults());
  }
}
