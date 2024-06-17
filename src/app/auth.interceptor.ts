import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from './core/services/user.service';
import { NO_CONTENT_TYPE_NO_ACCEPT } from './http.context';
import Swal from 'sweetalert2';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private _user: UserService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const shouldSetHeaders = !request.context.get(NO_CONTENT_TYPE_NO_ACCEPT);

    let headersConfig = {};

    if (request.headers.keys().length) {
      headersConfig = {
        Authorization: `Bearer ${this._user.token}`,
        ...request.headers.keys().reduce((acc, key) => {
          acc[key] = request.headers.get(key);
          return acc;
        }, {}),
      };
    } else if (shouldSetHeaders)
      headersConfig = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${this._user.token}`,
      };

    if (
      request.url.includes('https://inventario.ateneoerp.com') ||
      request.url.includes('ttps://inventario.emcosoft.com.co')
    ) {
      headersConfig = {};
    }

    const newRequest = request.clone({
      headers: new HttpHeaders(headersConfig),
    });

    return next.handle(newRequest).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          if (event['body'].status === false) {
            Swal.fire({
              icon: 'error',
              title: 'Algo no salió bien',
              text: event['body'].err,
              showCancelButton: false,
              confirmButtonColor: '#d33',
            });
            return;
          }
          event = event.clone({ body: this.modifyBody(event.body) });
        }
        return event;
      }),
    );
  }

  private modifyBody(body: any) {
    if (body?.respuesta) {
      if (body.respuesta == 'no autenticado') {
        window.location.reload();
      }
    }
  }
}
