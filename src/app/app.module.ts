import { HttpClient, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { LOCATION_INITIALIZED } from '@angular/common';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ToastrModule } from 'ngx-toastr';
import { CoreModule } from '@core/core.module';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppComponent } from './app.component';


const httpLoaderFactory = (http: HttpClient) => {
    return new TranslateHttpLoader(
        http,
        '/assets/i18n/',
        `.json?cache=${ new Date().getTime() }`
    );
};

/* eslint-disable no-console */
const appInitializerFactory = (translate: TranslateService, injector: Injector) => {
    return () => new Promise<boolean>((resolve) => {
        const locationInitialized = injector.get(LOCATION_INITIALIZED, Promise.resolve(null));
        locationInitialized.then(() => {
            const languageChoice = 'en'; // TODO: Get this from helper via storage and/or browser preference
            translate.setDefaultLang(languageChoice);
            translate.use(languageChoice).subscribe({
                next: () => {
                    console.log(`Successfully initialized '${ languageChoice }' language.'`);
                },
                error: () => {
                    console.error(`Problem with '${ languageChoice }' language initialization.`);
                },
                complete: () => {
                    resolve(true);
                },
            });
        });
    });
};
/* eslint-enable no-console */

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
        RouterModule,
        SharedModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: httpLoaderFactory,
                deps: [HttpClient],
            },
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
    providers: [
        {
            provide: APP_INITIALIZER,
            useFactory: appInitializerFactory,
            deps: [ TranslateService, Injector ],
            multi: true,
        },
    ],
    bootstrap: [ AppComponent ],
})
export class AppModule {

}
