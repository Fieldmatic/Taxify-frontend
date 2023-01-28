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
  @Input() route: [longitude: number, latitude: number][];

  checkboxPairs: number[] = [];
  petFriendly: boolean = false;
  babyFriendly: boolean = false;
  allComplete: boolean = false;
  linkedUsers: string[] = [];
  vehicleTypes: Task[] = [];
  loggedInUser: LoggedInUser;

  constructor(
    private filterDriversService: FilterDriversService,
    public dialog: MatDialog,
    private store: Store<fromApp.AppState>
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
    console.log(this.linkedUsers);
    console.log(this.babyFriendly);
    console.log(this.petFriendly);
    console.log(this.vehicleTypes);
    console.log(this.clientLocation);
    console.log(this.route);
    console.log(this.clientLocation);
    // this.store.dispatch(
    //   new PassengerActions.AddLinkedPassengers({
    //     sender: this.loggedInUser.email,
    //     linkedUsers: this.linkedUsers,
    //   })
    // );
  }
}
