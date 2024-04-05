import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

import { environment } from 'environments/environment';
import { STATUS } from '@shared/helpers';

@Injectable({ providedIn: 'root' })
export class ApiInterceptor implements HttpInterceptor {
    constructor(
        private readonly router: Router,
        private readonly toastr: ToastrService,
        private readonly translate: TranslateService,
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
                    this.router.navigate(['/auth/login']);
                } else if (error.status === STATUS.FORBIDDEN) {
                    this.toastr.error(
                        this.translate.instant('error.403.title') as string,
                        this.translate.instant('error.403.description') as string
                    );
                }
                return throwError(() => error);
            })
        );
    }
}
