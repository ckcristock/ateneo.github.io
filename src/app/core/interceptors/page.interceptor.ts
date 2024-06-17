import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lowercaseStatus } from '@shared/functions/lowercase-status.function';

import { Observable, map } from 'rxjs';

@Injectable()
export class PageInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse)
          if (event.body['data']?.data)
            event.body['data'].data = lowercaseStatus(event.body['data'].data);
        return event;
      }),
    );
  }
}
