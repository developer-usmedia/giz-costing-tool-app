import { ModuleWithProviders, NgModule } from '@angular/core';
import { BaseComponent } from '@core/containers/base/base.component';
import { ErrorPageComponent } from '@core/containers/error-page/error-page.component';
import { DashboardComponent } from '@core/containers/dashboard/dashboard.component';
import { ExamplesComponent } from '@core/containers/examples/examples.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { KeyValuePipe } from '@angular/common';

@NgModule({
    declarations: [
        BaseComponent,
        ErrorPageComponent,
        DashboardComponent,
        ExamplesComponent,
    ],
    exports: [
        BaseComponent,
    ],
    imports: [
        RouterModule,
        SharedModule,
        KeyValuePipe,
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
