import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-link-users-dialog',
  templateUrl: './link-users-dialog.component.html',
  styleUrls: ['./link-users-dialog.component.scss'],
})
export class LinkUsersDialogComponent implements OnInit {
  linkedUser: string;
  allLinkedUsers: string[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: string[],
    private dialogRef: MatDialogRef<LinkUsersDialogComponent>
  ) {}

  ngOnInit(): void {
    this.allLinkedUsers = this.data;
  }

  linkUser() {
    if (this.linkedUser) this.allLinkedUsers.push(this.linkedUser);
    document.getElementById('linkedUserInput')['value'] = '';
  }

  closeDialog() {
    this.dialogRef.close();
  }

  saveLinkedUsers() {
    this.dialogRef.close(this.allLinkedUsers);
  }
}
