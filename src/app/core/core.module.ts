import { DialogModule } from '@angular/cdk/dialog';
import { KeyValuePipe, NgClass } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BaseComponent } from '@core/containers/base/base.component';
import { DashboardComponent } from '@core/containers/dashboard/dashboard.component';
import { ErrorPageComponent } from '@core/containers/error-page/error-page.component';
import { ExamplesComponent } from '@core/containers/examples/examples.component';
import { SharedModule } from '@shared/shared.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApiInterceptor } from '@core/interceptors';
import { FooterComponent } from '@core/components/footer/footer.component';
import { BaseAuthComponent } from '@core/containers/base-auth/base-auth.component';
import { CdkMenuTrigger } from '@angular/cdk/menu';

@NgModule({
    declarations: [
        BaseComponent,
        BaseAuthComponent,
        ErrorPageComponent,
        FooterComponent,
        DashboardComponent,
        ExamplesComponent,
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
