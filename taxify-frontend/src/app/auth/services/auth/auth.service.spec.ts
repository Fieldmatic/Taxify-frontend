import { AuthService } from './auth.service';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import {
  APP_CONFIG,
  APP_SERVICE_CONFIG,
} from '../../../appConfig/appconfig.service';
import { Store, StoreModule } from '@ngrx/store';
import * as fromApp from '../../../store/app.reducer';

describe('Auth Service', () => {
  let httpClient: HttpClient;
  let service: AuthService;
  let httpMock: HttpTestingController;
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        StoreModule.forRoot(fromApp.appReducer),
      ],
      providers: [
        AuthService,
        HttpClient,
        {
          provide: APP_SERVICE_CONFIG,
          useValue: APP_CONFIG,
        },
      ],
    });
    service = TestBed.inject(AuthService);
    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    store = TestBed.inject(Store);
  });

  it('Auth Service should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Logout Timer should be set', fakeAsync(() => {
    service.setLogoutTimer(3);
    let storeDispatchSpy = spyOn(store, 'dispatch').and.callFake(() => {});
    tick(350);
    expect(storeDispatchSpy.calls.count()).toEqual(1);
  }));
});
