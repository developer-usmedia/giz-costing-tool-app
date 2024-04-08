import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '@core/containers/dashboard/dashboard.component';
import { ErrorPageComponent } from '@core/containers/error-page/error-page.component';
import { ExamplesComponent } from '@core/containers/examples/examples.component';
import { BaseAuthComponent } from '@core/containers/base-auth/base-auth.component';
import { MODULE_ROUTE, ROOT_ROUTE } from '@core/models';
import { BaseComponent } from '@core/containers/base/base.component';

const routes: Routes = [
    {
        path: MODULE_ROUTE.AUTH,
        component: BaseAuthComponent,
        loadChildren: () => import('./auth/auth.module').then((p) => p.AuthModule),
    },
    {
        path: '',
        component: BaseComponent,
        children: [
            {
                path: '',
                redirectTo: ROOT_ROUTE.DASHBOARD,
                pathMatch: 'full',
            },
            {
                path: ROOT_ROUTE.DASHBOARD,
                component: DashboardComponent,
            },
            {
                path: ROOT_ROUTE.EXAMPLES,
                component: ExamplesComponent,
            },
        ],
    },
    { path: 'error/404', component: ErrorPageComponent, data: { error: 404 } },
    { path: 'error/500', component: ErrorPageComponent, data: { error: 500 } },
    { path: '**', redirectTo: 'error/404' },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, { anchorScrolling: 'enabled', scrollOffset: [ 0, 50 ] }),
    ],
    exports: [ RouterModule ],
})
export class AppRoutingModule {
}
