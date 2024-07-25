import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, catchError, filter, switchMap, take, throwError } from 'rxjs';

import { AuthApi } from '@api/services';
import { AUTH_ROUTE, MODULE_ROUTE } from '@core/models';
import { AuthService } from '@core/services';
import { STATUS } from '@shared/helpers';
import { environment } from 'environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiInterceptor implements HttpInterceptor {
    private readonly toastr = inject(ToastrService);
    private readonly authApi = inject(AuthApi);
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);

    private isRefreshing = false;
    private readonly refreshTokenSubject = new BehaviorSubject<string | null>(null);

    public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (request.url.startsWith(environment.apiUrl)) {
            const token = this.authService.getToken();
            request = request.clone({
                withCredentials: true,
                setHeaders: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    Authorization: `Bearer ${ token?.accessToken ?? '' }`,
                },
            });
        }

        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === STATUS.UNAUTHORIZED && !error.url?.includes(this.authApi.baseUrl)) {
                    // Refresh token only if error is not from an auth (logout/refresh etc) route
                    return this.handle401Response(request, next);
                } else if (error.status === STATUS.FORBIDDEN) {
                    this.toastr.error(
                        $localize`:unauthorized title:403 Unauthorized`,
                        $localize`:unauthorized description:You are not authorized to do this. Please login with the correct user and rights.`,
                    );
                }
                return throwError(() => error);
            }),
        );
    }

    // TODO: Refactor
    // Current implementation https://www.bezkoder.com/angular-12-refresh-token/
    // Refactor to: https://www.bezkoder.com/angular-17-refresh-token/
    // Set short token (3s) to test the refreshing while refactoring
    public handle401Response(request: HttpRequest<any>, next: HttpHandler) {
        if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);

            return this.authService.refreshToken().pipe(
                catchError((error: HttpErrorResponse) => {
                    this.isRefreshing = false;
                    this.router.navigate([MODULE_ROUTE.AUTH, AUTH_ROUTE.LOGIN]);

                    return throwError(() => error);
                }),
                switchMap((refreshedToken) => {
                    this.isRefreshing = false;

                    this.authService.setToken(refreshedToken.accessToken, refreshedToken.refreshToken);
                    this.refreshTokenSubject.next(refreshedToken.accessToken);

                    return next.handle(request);
                }),
            );
        }

        return this.refreshTokenSubject.pipe(
            filter((token) => token !== null),
            take(1),
            switchMap(() => throwError(() => null)),
        );
    }
}
