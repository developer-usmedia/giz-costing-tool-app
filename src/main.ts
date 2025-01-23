/// <reference types="@angular/localize" />

import { enableProdMode, importProvidersFrom } from '@angular/core';
import { environment } from './environments/environment';
import { APP_BASE_HREF, PlatformLocation } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideTanStackQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { AppRoutingModule } from './app/app-routing.module';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { CoreModule } from '@core/core.module';
import { NgxsModule } from '@ngxs/store';
import { AppStore } from '@store/app.store';
import { RouterModule } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { AppComponent } from './app/app.component';

if (environment.production) {
    enableProdMode();
}

export function getBaseHref(platformLocation: PlatformLocation): string {
    return platformLocation.getBaseHrefFromDOM();
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(AppRoutingModule, BrowserModule, CoreModule.forRoot(), NgxsModule.forRoot([AppStore]), RouterModule, ToastrModule.forRoot({
            toastClass: 'toast',
            positionClass: 'toast-bottom-right',
            iconClasses: {
                error: 'toast--error',
                info: 'toast--info',
                success: 'toast--success',
                warning: 'toast--warning',
            },
            maxOpened: 4,
        })),
        {
            provide: APP_BASE_HREF,
            useFactory: getBaseHref,
            deps: [PlatformLocation],
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideTanStackQuery(new QueryClient()),
        provideAnimations(),
    ]
})
    .catch(err => console.error(err));
