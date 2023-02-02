import { LoggedInUser } from './../../../../auth/model/logged-in-user';
import { MatDialog } from '@angular/material/dialog';
import { LinkUsersDialogComponent } from './../link-users-dialog/link-users-dialog.component';
import { map } from 'rxjs';
import { FilterDriversService } from './services/filter-drivers.service';
import { Component, Input, OnInit } from '@angular/core';
import { Location } from 'src/app/maps/model/location';
import { Store } from '@ngrx/store';
import * as fromApp from '../../../../store/app.reducer';
import * as PassengerActions from '../../../../passengers/store/passengers.actions';
import { StompService } from 'src/app/stomp.service';
import { ToastrService } from 'ngx-toastr';
import * as MapActions from '../../../store/maps.actions';

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
export class FilterDriversComponent implements OnInit {
  @Input() clientLocation: Location;
  @Input() route: [longitude: number, latitude: number, stop: boolean][];

  checkboxPairs: number[] = [];
  petFriendly: boolean = false;
  babyFriendly: boolean = false;
  allComplete: boolean = false;
  linkedUsers: string[] = [];
  vehicleTypes: Task[] = [];
  loggedInUser: LoggedInUser;
  chosenVehicleTypes: string[] = [];

  constructor(
    private filterDriversService: FilterDriversService,
    public dialog: MatDialog,
    private store: Store<fromApp.AppState>,
    private stompService: StompService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
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
    this.setChosenVehicleTypes();

    if (this.linkedUsers.length > 0) {
      this.sentNotificationToLinkedPassengers();
      this.subscribeOnWebSocket();
    } else {
      this.searchForDriver();
    }
  }

  subscribeOnWebSocket() {
    const stompClient = this.stompService.connect();
    stompClient.connect({}, () => {
      stompClient.subscribe(
        '/topic/acceptedRideByLinkedPassengers/' + this.loggedInUser.email,
        (response): any => {
          this.showNotificationToast(response.body);
          this.searchForDriver();
        }
      );
    });
  }

  showNotificationToast(message: string) {
    this.toastr.info(message, 'Notification', {
      disableTimeOut: true,
      closeButton: true,
      tapToDismiss: true,
      newestOnTop: true,
      positionClass: 'toast-top-center',
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
        clientLocation: this.clientLocation,
        route: this.route,
        vehicleTypes: this.chosenVehicleTypes,
        petFriendly: this.petFriendly,
        babyFriendly: this.babyFriendly,
        sender: this.loggedInUser.email,
        linkedUsers: this.linkedUsers,
      })
    );
  }

  setChosenVehicleTypes() {
    this.vehicleTypes.forEach((type) => {
      if (type.completed) this.chosenVehicleTypes.push(type.name);
    });
  }
}
