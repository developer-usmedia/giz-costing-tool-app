import { APP_BASE_HREF, PlatformLocation } from '@angular/common';
import { AngularQueryDevtools } from '@tanstack/angular-query-devtools-experimental';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { QueryClient, provideAngularQuery } from '@tanstack/angular-query-experimental';
import { RouterModule } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppStore } from '@store/app.store';
import { CoreModule } from '@core/core.module';
import { SharedModule } from '@shared/shared.module';

export function getBaseHref(platformLocation: PlatformLocation): string {
    return platformLocation.getBaseHrefFromDOM();
}

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        AppRoutingModule,
        BrowserModule,
        BrowserAnimationsModule,
        CoreModule.forRoot(),
        HttpClientModule,
        NgxsModule.forRoot([AppStore]),
        RouterModule,
        SharedModule,
        ToastrModule.forRoot({
            toastClass: 'toast',
            positionClass: 'toast-bottom-right',
            iconClasses: {
                error: 'toast--error',
                info: 'toast--info',
                success: 'toast--success',
                warning: 'toast--warning',
            },
            maxOpened: 4,
        }),
        AngularQueryDevtools,
    ],
    providers: [
        {
            provide: APP_BASE_HREF,
            useFactory: getBaseHref,
            deps: [PlatformLocation],
        },
        provideHttpClient(),
        provideAngularQuery(new QueryClient()),
    ],
    bootstrap: [ AppComponent ],
})
export class AppModule {

}
