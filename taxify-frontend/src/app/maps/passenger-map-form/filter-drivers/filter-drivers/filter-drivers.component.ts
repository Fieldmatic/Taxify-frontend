import { LoggedInUser } from './../../../../auth/model/logged-in-user';
import { MatDialog } from '@angular/material/dialog';
import { LinkUsersDialogComponent } from './../link-users-dialog/link-users-dialog.component';
import { map, Subscription } from 'rxjs';
import { FilterDriversService } from './services/filter-drivers.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from '../../../../store/app.reducer';
import * as PassengerActions from '../../../../passengers/store/passengers.actions';
import { StompService } from 'src/app/stomp.service';
import * as MapActions from '../../../store/maps.actions';
import { PaymentMethodSelectionDialogComponent } from '../payment-method-selection-dialog/payment-method-selection-dialog.component';
import { PaymentMethod } from '../../../../shared/model/payment-method.model';
import { Router } from '@angular/router';
import { NotifierService } from 'src/app/shared/services/notifier.service';

export interface Task {
  name: string;
  completed: boolean;
  image: string;
}

@Component({
  selector: 'app-filter-drivers',
  templateUrl: './filter-drivers.component.html',
  styleUrls: ['./filter-drivers.component.scss'],
})
export class FilterDriversComponent implements OnInit, OnDestroy {
  checkboxPairs: number[] = [];
  petFriendly: boolean = false;
  babyFriendly: boolean = false;
  allComplete: boolean = false;
  linkedUsers: string[] = [];
  vehicleTypes: Task[] = [];
  loggedInUser: LoggedInUser;
  chosenVehicleTypes: string[] = [];
  paymentMethods: PaymentMethod[];
  paymentMethodId: string;
  distance: number;

  usersSubscription: Subscription;
  locationNames: string[];
  route: [longitude: number, latitude: number, stop: boolean][];

  constructor(
    private filterDriversService: FilterDriversService,
    public dialog: MatDialog,
    private store: Store<fromApp.AppState>,
    private stompService: StompService,
    private notifierService: NotifierService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.store
      .select((store) => store.maps)
      .subscribe((mapsState) => {
        let sortedMap = new Map([...mapsState.selectedRoute].sort());
        this.locationNames = mapsState.locationNames;
        this.distance = mapsState.routeDistance;
        this.route = [];
        sortedMap.forEach((value) => {
          value.route.forEach((coordinates) => {
            this.route.push([coordinates[0], coordinates[1], false]);
          });
          this.route[this.route.length - 1][2] = true;
        });
      });
    this.filterDriversService.getVehicleTypes().subscribe((types) => {
      for (let i = 0; i < types.length; i++) {
        let type = types.at(i);
        this.vehicleTypes.push({
          name: type,
          image: '../assets/' + type + '.png',
          completed: true,
        });
        if (i % 2 === 0) this.checkboxPairs.push(i);
      }
    });

    this.store
      .select('auth')
      .pipe(map((authState) => authState.user))
      .subscribe((user) => {
        this.loggedInUser = user;
      });

    this.usersSubscription = this.store
      .select('users')
      .subscribe((usersState) => {
        this.paymentMethods = usersState.loggedUserPaymentMethods;
      });
  }

  ngOnDestroy(): void {
    this.usersSubscription.unsubscribe();
  }

  updateAllVehicleTypesSelected() {
    this.allComplete =
      this.vehicleTypes != null && this.vehicleTypes.every((t) => t.completed);
  }

  markSomeVehicleTypes(): boolean {
    if (this.vehicleTypes == null) {
      return false;
    }
    return (
      this.vehicleTypes.filter((t) => t.completed).length > 0 &&
      !this.allComplete
    );
  }

  setAllVehicleTypes(completed: boolean) {
    this.allComplete = completed;
    if (this.vehicleTypes == null) {
      return;
    }
    this.vehicleTypes.forEach((t) => (t.completed = completed));
  }

  openLinkUsersDialog() {
    const dialogRef = this.dialog.open(LinkUsersDialogComponent, {
      disableClose: true,
      data: this.linkedUsers,
    });

    dialogRef.beforeClosed().subscribe((result) => {
      this.linkedUsers = result;
    });
  }

  continue() {
    if (!this.paymentMethodId) {
      this.notifierService.notifyInfo("You must select a payment type before searching a ride!")
      return;
    }
    this.setChosenVehicleTypes();
    if (this.linkedUsers.length > 0) {
      this.sentNotificationToLinkedPassengers();
      this.subscribeOnWebSocket();
    } else {
      this.router.navigate(['/maps']);
      this.searchForDriver();
    }
  }

  subscribeOnWebSocket() {
    const stompClient = this.stompService.connect();
    stompClient.connect({}, () => {
      stompClient.subscribe(
        '/topic/acceptedRideByLinkedPassengers/' + this.loggedInUser.email,
        (response): any => {
          this.notifierService.notifyInfo(response.body);
          this.searchForDriver();
        }
      );
    });
  }

  sentNotificationToLinkedPassengers() {
    this.store.dispatch(
      new PassengerActions.AddLinkedPassengers({
        sender: this.loggedInUser.email,
        linkedUsers: this.linkedUsers,
      })
    );
  }

  searchForDriver() {
    this.store.dispatch(
      new MapActions.SearchForDriver({
        route: this.route,
        locationNames: this.locationNames,
        vehicleTypes: this.chosenVehicleTypes,
        petFriendly: this.petFriendly,
        babyFriendly: this.babyFriendly,
        sender: this.loggedInUser.email,
        linkedUsers: this.linkedUsers,
        paymentMethodId: this.paymentMethodId,
        routeDistance: this.distance,
      })
    );
  }

  setChosenVehicleTypes() {
    this.vehicleTypes.forEach((type) => {
      if (type.completed) this.chosenVehicleTypes.push(type.name);
    });
  }

  openPaymentMethodDialog() {
    if (this.paymentMethods.length > 0) {
      const dialogRef = this.dialog.open(
        PaymentMethodSelectionDialogComponent,
        {
          disableClose: true,
          data: this.paymentMethodId,
        }
      );
      dialogRef.beforeClosed().subscribe((result) => {
        this.paymentMethodId = result;
      });
    } else {
      this.notifierService.notifyInfo(
        'You have no payment methods added, go and add one first!'
      );
    }
  }

  getPaymentMethodById(id: string): PaymentMethod | null {
    for (let paymentMethod of this.paymentMethods) {
      if (paymentMethod.id === id) {
        return paymentMethod;
      }
    }
    return null;
  }
}
