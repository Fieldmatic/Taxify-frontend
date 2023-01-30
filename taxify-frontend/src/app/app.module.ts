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
import { NavbarProfileMenuComponent } from './navbar/navbar-profile-menu/navbar-profile-menu.component';
import { MatMenuModule } from '@angular/material/menu';
import { HotToastModule } from '@ngneat/hot-toast';
import { MapsEffects } from './maps/store/maps.effects';
import { MapsService } from './maps/maps.service';
import { CustomerSupportModule } from './customer-support/customer-support.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CustomerSupportEffects } from './customer-support/store/customer-support.effects';

@NgModule({
  declarations: [AppComponent, NavbarComponent, NavbarProfileMenuComponent],
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
      CustomerSupportEffects,
    ]),
    StoreDevtoolsModule.instrument({ logOnly: environment.production }),
    StoreRouterConnectingModule.forRoot(),
    HotToastModule.forRoot({ position: 'top-center', dismissible: true }),
    CustomerSupportModule,
    UsersModule,
    MapsModule,
    AuthModule,
    AppRoutingModule,
    MatMenuModule,
    MatTooltipModule,
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
