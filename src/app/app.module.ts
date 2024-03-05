import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';
import { BaseComponent } from '@core/containers/base/base.component';
import { ErrorPageComponent } from '@core/containers/error-page/error-page.component';
import { DashboardComponent } from '@core/containers/dashboard/dashboard.component';

const httpLoaderFactory = (http: HttpClient) => {
    return new TranslateHttpLoader(
        http,
        '/assets/i18n/',
        `.json?cache=${ new Date().getTime() }`
    );
};

@NgModule({
    declarations: [
        AppComponent,
        BaseComponent,
        ErrorPageComponent,
        DashboardComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: httpLoaderFactory,
                deps: [HttpBackend],
            },
            isolate: true,
        }),
        ToastrModule.forRoot({
            toastClass: 'toast',
            positionClass: 'toast-bottom-right',
            iconClasses: {
                error: 'toast--error',
                info: 'toast--info',
                success: 'toast--success',
                warning: 'toast--warning',
            },
            maxOpened: 2,
        }),
    ],
    providers: [ ],
    bootstrap: [ AppComponent ],
})
export class AppModule {
}
