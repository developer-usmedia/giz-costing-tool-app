import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BaseComponent } from '@core/containers/base/base.component';
import { DashboardComponent } from '@core/containers/dashboard/dashboard.component';
import { ErrorPageComponent } from '@core/containers/error-page/error-page.component';
import { ExamplesComponent } from '@core/containers/examples/examples.component';

const routes: Routes = [
    {
        path: '',
        component: BaseComponent,
        children: [
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full',
            },
            {
                path: 'examples',
                component: ExamplesComponent,
            },
            {
                path: 'dashboard',
                component: DashboardComponent,
            },
        ],
    },
    { path: 'error/404', component: ErrorPageComponent, data: { error: 404 } },
    { path: 'error/500', component: ErrorPageComponent, data: { error: 500 } },
    { path: '**', redirectTo: 'error/404' },
];

@NgModule({
    imports: [ RouterModule.forRoot(routes, {
        anchorScrolling: 'enabled',
        scrollOffset: [0, 50],
    }) ],
    exports: [ RouterModule ],
})
export class AppRoutingModule {
}
