import { DialogModule } from '@angular/cdk/dialog';
import { KeyValuePipe } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { BaseComponent } from '@core/containers/base/base.component';
import { DashboardComponent } from '@core/containers/dashboard/dashboard.component';
import { ErrorPageComponent } from '@core/containers/error-page/error-page.component';
import { ExamplesComponent } from '@core/containers/examples/examples.component';
import { FooterComponent } from '@shared/components/footer/footer.component';
import { SharedModule } from '@shared/shared.module';

@NgModule({
    declarations: [
        BaseComponent,
        ErrorPageComponent,
        DashboardComponent,
        ExamplesComponent,
        FooterComponent,
    ],
    exports: [
        BaseComponent,
    ],
    imports: [
        DialogModule,
        RouterModule,
        SharedModule,
        KeyValuePipe,
        TranslateModule,
    ],
})
export class CoreModule {
    static forRoot(): ModuleWithProviders<CoreModule> {
        return {
            ngModule: CoreModule,
            providers: [],
        };
    }
}
