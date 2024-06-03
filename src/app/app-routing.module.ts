import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BaseAuthComponent } from '@core/containers/base-auth/base-auth.component';
import { BaseComponent } from '@core/containers/base/base.component';
import { DashboardComponent } from '@core/containers/dashboard/dashboard.component';
import { ErrorPageComponent } from '@core/containers/error-page/error-page.component';
import { ExamplesComponent } from '@core/containers/examples/examples.component';
import { AuthGuard } from '@core/guards/auth.guard';
import { MODULE_ROUTE, ROOT_ROUTE } from '@core/models';

const routes: Routes = [
    {
        path: MODULE_ROUTE.AUTH,
        component: BaseAuthComponent,
        loadChildren: () => import('./auth/auth.module').then((p) => p.AuthModule),
    },
    {
        path: '',
        component: BaseComponent,
        canActivate: [AuthGuard],
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
    // TEMP routes to demonstate that if angular does the routing useQuery will be able to use its cache.
    // As soon as you reload the page and probably reinitialie angular (state?) useQuery will not be able to cache it
    // To demonstrate open network tab and start navigating through eacth footer link -> only 1 session request
    // You can also see this happen in salary matrix with googlapi://account?lookup request for idp
    { path: 'imprint', component: BaseComponent },
    { path: 'terms', component: BaseComponent },
    { path: 'data-protection', component: BaseComponent },
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
