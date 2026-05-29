import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';

import { Injectable } from '@angular/core';

import { Router } from '@angular/router';

import {
  Observable,
  throwError
} from 'rxjs';

import { catchError } from 'rxjs/operators';

@Injectable()

export class AuthInterceptor
implements HttpInterceptor {

  constructor(
    private router: Router
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    const token =
      sessionStorage.getItem('token');

    let modifiedRequest = request;

    if (token) {
      modifiedRequest =
        request.clone({setHeaders: {Authorization:`Bearer ${token}`}
  });

    }

    return next
      .handle(modifiedRequest)
      .pipe(
        catchError(
          (error: HttpErrorResponse) => {
            if (error.status === 401) {
              sessionStorage.removeItem('token');
              this.router.navigate(['/']);
            }
            return throwError(() => error);
          }
        )
      );
  }
}