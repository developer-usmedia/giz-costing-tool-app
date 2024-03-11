import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';
import { CoreModule } from '@core/core.module';

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
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        CoreModule.forRoot(),
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
