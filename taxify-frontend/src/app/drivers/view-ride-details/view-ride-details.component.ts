import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Route } from '../../maps/model/route';
import { Feature } from 'ol';
import { LineString, Point } from 'ol/geom';
import OLMap from 'ol/Map';
import { fromLonLat } from 'ol/proj';
import { Stroke, Style } from 'ol/style';
import { BehaviorSubject, take } from 'rxjs';
import * as MapUtils from '../../maps/mapUtils';
import { Location } from 'src/app/maps/model/location';
import { MapsService } from 'src/app/maps/maps.service';
import VectorSource from 'ol/source/Vector';
import {Observable} from 'rxjs'
import { Driver } from 'src/app/shared/model/driver.model';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import * as MapActions from '../../maps/store/maps.actions';
import { Router } from '@angular/router';
import { User } from 'src/app/shared/model/user.model';
@Component({
  selector: 'app-view-ride-details',
  templateUrl: './view-ride-details.component.html',
  styleUrls: ['./view-ride-details.component.scss']
})
export class ViewRideDetailsComponent implements OnInit {
  private mapSource = new BehaviorSubject<OLMap>(this.initMap());
  locationsVectorSource: VectorSource;
  routesVectorSource: VectorSource;
  map = this.mapSource.asObservable();
  loading: boolean;
  rideDetailsRoute$: Observable<Map<string,Route>>;
  rideDetailsDriver$: Observable<Driver>;
  passengers: User[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ViewRideDetailsComponent>,
    public mapService: MapsService,
    private store: Store<fromApp.AppState>,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.initMap();
    this.passengers = this.data['passengers'];
    console.log(this.passengers)
    this.mapSource.value.setTarget('ride-details-map');
    this.locationsVectorSource = <VectorSource>(
      this.mapSource.value.getAllLayers()[1].getSource()
    );
    this.routesVectorSource = <VectorSource>(
      this.mapSource.value.getAllLayers()[2].getSource()
    );
    this.rideDetailsRoute$ = this.store.select((store) => store.passengers.rideDetailsRoute)
    this.rideDetailsDriver$ = this.store.select((store) => store.passengers.rideDetailsDriver)
    this.drawRoute()
  }

  closeDialogOnNo() {
    this.dialogRef.close();
  }

  drawRoute() {
    this.rideDetailsRoute$.subscribe(routeMap => {
      this.routesVectorSource.clear()
      this.locationsVectorSource.clear()
      for (let key of routeMap.keys()) {
            if (key === 'location1') {
              this.drawLocation(new Location(routeMap.get(key).route[0][1], routeMap.get(key).route[0][0]), 'location0',  '../../assets/pickup.png');
              this.recenterToLocation(routeMap.get(key).route[0][0], routeMap.get(key).route[0][1])
            }
            this.drawLocation(new Location(routeMap.get(key).route[routeMap.get(key).route.length-1][1], routeMap.get(key).route[routeMap.get(key).route.length-1][0]), key,'../../assets/pin.png');
            const routeFeature = this.mapService.getRouteFeature(
              routeMap.get(key),
              key,
              '#4A89F3',
              4,
              200
            );
            this.routesVectorSource.addFeature(routeFeature);
            const routeFeatureBackground = this.mapService.getRouteFeature(
              routeMap.get(key),
              key.concat('bg'),
              '#002E6E',
              6,
              100
            );
            this.routesVectorSource.addFeature(routeFeatureBackground);

            }
    })
  }

  drawLocation(location: Location, id: string, icon: string) {
    let marker = new Feature({
      geometry: new Point(fromLonLat([location.longitude, location.latitude])),
      location: location,
    });
    marker.setId(id);
    marker.setStyle(this.mapService.getMarkerStyle(icon));
    this.locationsVectorSource.addFeature(marker);
  }

  recenterToLocation(longitude, latitude) {
    this.mapSource.value.getView().setCenter(fromLonLat([longitude, latitude]));
  }

  initMap() {
    return MapUtils.createEmptyMap([19.839388, 45.247744]);
  }

}
