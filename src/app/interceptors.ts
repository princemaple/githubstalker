import {Injectable} from '@angular/core';
import {HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';

import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    if (!req.url.startsWith('https://api.github.com/')) {
      return next.handle(req);
    }

    const token = localStorage.getItem('OCTO_STALKER_GITHUB_TOKEN');

    if (!token) {
      return next.handle(req);
    }

    return next.handle(
      req.clone({
        setHeaders: {Authorization: `Bearer ${token}`},
      }),
    );
  }
}
