import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';
import { CoreModule } from '@core/core.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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
        TranslateModule.forRoot({
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
