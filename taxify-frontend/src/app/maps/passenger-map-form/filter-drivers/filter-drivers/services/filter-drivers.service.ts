import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from 'src/app/appConfig/appconfig.interface';
import { APP_SERVICE_CONFIG } from 'src/app/appConfig/appconfig.service';

@Injectable({
  providedIn: 'root',
})
export class FilterDriversService {
  constructor(
    @Inject(APP_SERVICE_CONFIG) private config: AppConfig,
    private http: HttpClient
  ) {}

  getVehicleTypes() {
    return this.http.get<string[]>(
      this.config.apiEndpoint + `vehicle/vehicleTypes`
    );
  }
}
