import { DialogModule } from '@angular/cdk/dialog';
import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import { AsyncPipe, KeyValuePipe, SlicePipe, NgClass } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CdkMenuTrigger } from '@angular/cdk/menu';

import { AccountComponent } from '@core/containers/account/account.component';
import { BaseContentComponent } from '@core/containers/base-content/base-content.component';
import { ApiInterceptor } from '@core/interceptors';
import { BaseAuthComponent } from '@core/containers/base-auth/base-auth.component';
import { BaseComponent } from '@core/containers/base/base.component';
import { CpDataProtectionComponent } from './containers/cp-data-protection/cp-data-protection.component';
import { CpImprintComponent } from './containers/cp-imprint/cp-imprint.component';
import { CpTermsComponent } from './containers/cp-terms/cp-terms.component';
import { DashboardComponent } from '@core/containers/dashboard/dashboard.component';
import { ErrorPageComponent } from '@core/containers/error-page/error-page.component';
import { ExamplesComponent } from '@core/containers/examples/examples.component';
import { FooterComponent } from '@core/components/footer/footer.component';
import { HeaderComponent } from '@core/components/header/header.component';
import { HomepageComponent } from './containers/homepage/homepage.component';
import { SharedModule } from '@shared/shared.module';

@NgModule({
    declarations: [
        AccountComponent,
        BaseAuthComponent,
        BaseComponent,
        BaseContentComponent,
        CpDataProtectionComponent,
        CpImprintComponent,
        CpTermsComponent,
        DashboardComponent,
        ErrorPageComponent,
        ExamplesComponent,
        FooterComponent,
        HeaderComponent,
        HomepageComponent,
    ],
    exports: [],
    imports: [
        AsyncPipe,
        CdkMenuTrigger,
        CdkOverlayOrigin,
        DialogModule,
        KeyValuePipe,
        NgClass,
        RouterModule,
        SharedModule,
        SlicePipe,
    ],
})
export class CoreModule {
    static forRoot(): ModuleWithProviders<CoreModule> {
        return {
            ngModule: CoreModule,
            providers: [
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: ApiInterceptor,
                    multi: true,
                },
            ],
        };
    }
}
