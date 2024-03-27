import { DialogModule } from '@angular/cdk/dialog';
import { AsyncPipe, KeyValuePipe, SlicePipe, NgClass } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CdkMenuTrigger } from '@angular/cdk/menu';

import { AccountComponent } from '@core/containers/account/account.component';
import { ApiInterceptor } from '@core/interceptors';
import { BaseAuthComponent } from '@core/containers/base-auth/base-auth.component';
import { BaseComponent } from '@core/containers/base/base.component';
import { DashboardComponent } from '@core/containers/dashboard/dashboard.component';
import { ErrorPageComponent } from '@core/containers/error-page/error-page.component';
import { ExamplesComponent } from '@core/containers/examples/examples.component';
import { FooterComponent } from '@core/components/footer/footer.component';
import { HeaderComponent } from '@core/components/header/header.component';
import { SharedModule } from '@shared/shared.module';

@NgModule({
    declarations: [
        AccountComponent,
        BaseComponent,
        BaseAuthComponent,
        DashboardComponent,
        ErrorPageComponent,
        ExamplesComponent,
        FooterComponent,
        HeaderComponent,
    ],
    exports: [
    ],
    imports: [
        DialogModule,
        RouterModule,
        SharedModule,
        KeyValuePipe,
        NgClass,
        CdkMenuTrigger,
        AsyncPipe,
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
