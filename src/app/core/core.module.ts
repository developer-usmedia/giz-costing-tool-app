import { DialogModule } from '@angular/cdk/dialog';
import { CdkMenuTrigger } from '@angular/cdk/menu';
import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import { AsyncPipe, DatePipe, KeyValuePipe, NgClass, SlicePipe } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { FooterComponent } from '@core/components/footer/footer.component';
import { HeaderComponent } from '@core/components/header/header.component';
import {
    AccountChangePasswordDialogComponent,
} from '@core/containers/account-change-password-dialog/account-change-password-dialog.component';
import {
    AccountDisable2FaDialogComponent,
} from '@core/containers/account-disable-2factor-dialog/account-disable2fa-dialog.component';
import {
    AccountEnable2FaDialogComponent,
} from '@core/containers/account-enable-2factor-dialog/account-enable2fa-dialog.component';
import { AccountRemoveDialogComponent } from '@core/containers/account-remove-dialog/account-remove-dialog.component';
import { AccountComponent } from '@core/containers/account/account.component';
import { BaseAuthComponent } from '@core/containers/base-auth/base-auth.component';
import { BaseContentComponent } from '@core/containers/base-content/base-content.component';
import { BaseComponent } from '@core/containers/base/base.component';
import { DashboardComponent } from '@core/containers/dashboard/dashboard.component';
import { ErrorPageComponent } from '@core/containers/error-page/error-page.component';
import { ExamplesComponent } from '@core/containers/examples/examples.component';
import { ApiInterceptor } from '@core/interceptors';
import { SharedModule } from '@shared/shared.module';
import { CpDataProtectionComponent } from './containers/cp-data-protection/cp-data-protection.component';
import { CpImprintComponent } from './containers/cp-imprint/cp-imprint.component';
import { CpTermsComponent } from './containers/cp-terms/cp-terms.component';
import { HomepageComponent } from './containers/homepage/homepage.component';

@NgModule({
    declarations: [
        AccountComponent,
        AccountChangePasswordDialogComponent,
        AccountDisable2FaDialogComponent,
        AccountEnable2FaDialogComponent,
        AccountRemoveDialogComponent,
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
        DatePipe,
        ReactiveFormsModule,
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
