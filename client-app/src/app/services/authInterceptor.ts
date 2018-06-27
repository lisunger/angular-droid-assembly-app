import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler): Observable<HttpEvent<any>> {


    // console.log('Request intercepted!', req.url);
    const idToken = localStorage.getItem('token');
    console.log("Token");
    console.log(idToken);

    if (idToken) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + idToken)});

      return next.handle(cloned);
    } else {
      return next.handle(req);
    }
  }
}
