import * as fromApp from '../store/app.reducer';
import { Store } from '@ngrx/store';
import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { exhaustMap, map, Observable, take } from 'rxjs';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private store: Store<fromApp.AppState>) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.headers.get('skip')) {
      req = req.clone({
        headers: req.headers.delete('skip'),
      });
      return next.handle(req);
    }
    return this.store.select('auth').pipe(
      take(1),
      map((authState) => {
        return authState.user;
      }),
      exhaustMap((user) => {
        if (!user) {
          return next.handle(req);
        }
        const modifiedReq = req.clone({
          headers: new HttpHeaders({ Authorization: 'Bearer ' + user.token }),
        });
        return next.handle(modifiedReq);
      })
    );
  }
}
