import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { environment } from 'environments/environment';
import { STATUS } from '@shared/helpers';
import { AUTH_ROUTE, MODULE_ROUTE } from '@core/models';

@Injectable({ providedIn: 'root' })
export class ApiInterceptor implements HttpInterceptor {
    constructor(
        private readonly router: Router,
        private readonly toastr: ToastrService,
    ) {}

    public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (request.url.startsWith(environment.apiUrl)) {
            request = request.clone({
                withCredentials: true,
            });
        }

        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === STATUS.UNAUTHORIZED) {
                    this.router.navigate([MODULE_ROUTE.AUTH, AUTH_ROUTE.LOGIN]);
                } else if (error.status === STATUS.FORBIDDEN) {
                    this.toastr.error(
                        $localize`:unauthorized title:403 Unauthorized`,
                        $localize`:unauthorized description:You are not authorized to do this. Please login with the correct user and rights.`
                    );
                }
                return throwError(() => error);
            })
        );
    }
}
