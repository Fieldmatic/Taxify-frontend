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

  checkboxPairs: number[] = [];
  petFriendly: boolean = false;
  babyFriendly: boolean = false;
  allComplete: boolean = false;
  linkedUsers: string[] = [];
  vehicleTypes: Task[] = [];

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
      this.linkedUsers.concat(result);
    });
  }

  continue() {
    console.log(this.linkedUsers);
    this.store.dispatch(
      new PassengerActions.AddLinkedPassengers({
        sender: 'ivana@gmail.com',
        linkedUsers: this.linkedUsers,
      })
    );
  }
}
