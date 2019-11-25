import { tap } from 'rxjs/operators';

import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse} from '@angular/common/http';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class MyInterceptor implements HttpInterceptor {
  constructor() {
    console.log('Intercerptor Constructor Called');
   }
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    // const updatedRequest = request.clone({

    //   headers: new HttpHeaders({
    //     'Authorization': 'basic vijay',
    //     'Access-Control-Allow-Headers': 'Content-Type',
    //     'Access-Control-Allow-Methods': 'GET',
    //     'Access-Control-Allow-Origin': '*',
    //   }),
    //   withCredentials: true
    // });

    // const updatedRequest = request.clone({

    //   headers: request.headers.append('Content-Type' , 'application/json'),
    //   withCredentials: true
    // });

    // if (request.body) {
    //   const duplicate = request.clone({ body: request.body.replace(/pizza/gi, '🍕') });
    //   return next.handle(duplicate);
    // }
    console.log('Before making api call : ', 'updatedRequest');
    return next.handle(request).pipe(
      tap(
        event => {
          console.log('api call success');
          if (event instanceof HttpResponse) {
            console.log('api call success :', event);
          }
        },
        error => {
          console.log('api call success :');
          if (event instanceof HttpResponse) {
            console.log('api call error :', event);
          }
        }
      )
    );
  }
}