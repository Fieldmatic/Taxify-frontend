import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AppConfig } from '../appConfig/appconfig.interface';
import { APP_SERVICE_CONFIG } from '../appConfig/appconfig.service';

@Injectable({
  providedIn: 'root',
})
export class PassengerService {
  constructor(
    @Inject(APP_SERVICE_CONFIG) private config: AppConfig,
    private http: HttpClient
  ) {}

  activateEmail(token: string) {
    return this.http.put<void>(
      this.config.apiEndpoint + 'passenger/activateEmail/' + token,
      {}
    );
  }
}
