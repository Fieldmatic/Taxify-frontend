import { DirectivesModule } from './directives/directives.module';
import { PassengerEffects } from './passengers/store/passengers.effects';
import { AuthEffects } from './auth/store/auth.effects';
import { APP_CONFIG, APP_SERVICE_CONFIG } from './appConfig/appconfig.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './navbar/navbar.component';
import { StompService } from './stomp.service';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { DriversEffects } from './drivers/store/drivers.effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { ReactiveFormsModule } from '@angular/forms';
import * as fromApp from './store/app.reducer';
import { SharedModule } from './shared/shared.module';
import { MapsModule } from './maps/maps.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { AuthModule } from 'src/app/auth/auth.module';
import { UsersModule } from './users/users.module';
import { UsersEffects } from './users/store/users.effects';
import { MapsEffects } from './maps/store/maps.effects';
import { MapsService } from './maps/maps.service';
import { ToastrModule } from 'ngx-toastr';
import { NotificationsComponent } from './navbar/notifications/notifications/notifications.component';
import { PassengersModule } from './passengers/passengers.module';
import { DriversComponent } from './drivers/drivers.component';
import { PathLocationStrategy } from '@angular/common';

@NgModule({
  declarations: [AppComponent, NavbarComponent, NotificationsComponent, DriversComponent],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
    StoreModule.forRoot(fromApp.appReducer),
    EffectsModule.forRoot([
      DriversEffects,
      AuthEffects,
      UsersEffects,
      MapsEffects,
      PassengerEffects,
    ]),
    StoreDevtoolsModule.instrument({ logOnly: environment.production }),
    StoreRouterConnectingModule.forRoot(),
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    UsersModule,
    MapsModule,
    AuthModule,
    PassengersModule,
    AppRoutingModule,
    DirectivesModule,
  ],
  providers: [
    StompService,
    MapsService,
    {
      provide: APP_SERVICE_CONFIG,
      useValue: APP_CONFIG,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
  
})
export class AppModule {}
