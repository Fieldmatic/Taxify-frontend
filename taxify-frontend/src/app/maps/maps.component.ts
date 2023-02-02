import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss'],
})
export class MapsComponent implements OnInit {
  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit(): void {}
}
