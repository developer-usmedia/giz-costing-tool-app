import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ToastrModule } from 'ngx-toastr';

import { CoreModule } from '@core/core.module';
import { SharedModule } from '@shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

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
        AppRoutingModule,
        BrowserModule,
        BrowserAnimationsModule,
        CoreModule.forRoot(),
        HttpClientModule,
        SharedModule,
        TranslateModule.forRoot({
            defaultLanguage: 'en',
            loader: {
                provide: TranslateLoader,
                useFactory: httpLoaderFactory,
                deps: [HttpClient],
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
            maxOpened: 4,
        }),
    ],
    providers: [ ],
    bootstrap: [ AppComponent ],
})
export class AppModule {
}
