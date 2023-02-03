import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { User } from '../../../../shared/model/user.model';
import * as fromApp from '../../../../store/app.reducer';
import { Subscription } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import * as UsersActions from '../../../store/users.actions';
import { ConfirmationDialogWithNotesComponent } from '../../../../shared/components/confirmation-dialog-with-notes/confirmation-dialog-with-notes.component';

@Component({
  selector: 'app-users-crud',
  templateUrl: './users-crud.component.html',
  styleUrls: ['./users-crud.component.scss'],
})
export class UsersCrudComponent implements OnInit, AfterViewInit {
  users: User[];
  usersSubscription: Subscription;
  displayedColumns: string[] = ['name', 'email', 'role', 'blocked'];
  dataSource: MatTableDataSource<User>;
  blockedUsers: boolean = false;
  selectedRole = new FormControl('');
  roleList = ['PASSENGER', 'DRIVER', 'ADMIN'];
  searchControl = new FormControl('');

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private store: Store<fromApp.AppState>,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.usersSubscription = this.store
      .select('users')
      .subscribe((usersState) => {
        this.dataSource = new MatTableDataSource<User>(usersState.users);
      });
    this.dataSource.filterPredicate = this.getFilterPredicate();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter() {
    const filterValue =
      this.searchControl.value +
      '|' +
      this.blockedUsers +
      '|' +
      this.selectedRole.value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getFilterPredicate() {
    return (row: User, filters: string) => {
      const filterArray = filters.split('|');
      const searchFilters = filterArray[0].split(' ');
      const showBlockedUsers = filterArray[1] === 'true';
      const roleFilters = filterArray[2].split(',');

      let matchFilter = [];

      for (let searchFilter of searchFilters) {
        matchFilter.push(
          row.name.toLowerCase().includes(searchFilter) ||
            row.surname.toLowerCase().includes(searchFilter) ||
            row.email.toLowerCase().includes(searchFilter)
        );
      }

      if (filterArray[2] !== '') {
        let roleMatch = false;
        for (let role of roleFilters) {
          if (row.role.toLowerCase() === role) {
            roleMatch = true;
          }
        }
        matchFilter.push(roleMatch);
      }

      if (showBlockedUsers) {
        matchFilter.push(showBlockedUsers === row.blocked);
      }
      return matchFilter.every(Boolean);
    };
  }

  toggleIsBlocked(row) {
    const action = row.blocked ? 'Unblock' : 'Block';
    this.dialog.open(ConfirmationDialogWithNotesComponent, {
      width: 'fit-content',
      data: {
        title: action + ' User',
        text:
          'Do you want to ' +
          action.toLowerCase() +
          ' user with email ' +
          row.email +
          '?',
        additionalData: [row.email],
        actionType: UsersActions.TOGGLE_USER_IS_BLOCKED,
      },
    });
  }

  toggleBlockedUsers() {
    this.blockedUsers = !this.blockedUsers;
    this.applyFilter();
  }
}
