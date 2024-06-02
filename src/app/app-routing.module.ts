import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AccountComponent } from '@core/containers/account/account.component';
import { AuthGuard } from '@core/guards/auth.guard';
import { BaseAuthComponent } from '@core/containers/base-auth/base-auth.component';
import { BaseComponent } from '@core/containers/base/base.component';
import { CpDataProtectionComponent } from '@core/containers/cp-data-protection/cp-data-protection.component';
import { CpImprintComponent } from '@core/containers/cp-imprint/cp-imprint.component';
import { CpTermsComponent } from '@core/containers/cp-terms/cp-terms.component';
import { DashboardComponent } from '@core/containers/dashboard/dashboard.component';
import { ErrorPageComponent } from '@core/containers/error-page/error-page.component';
import { ExamplesComponent } from '@core/containers/examples/examples.component';
import { HomepageComponent } from '@core/containers/homepage/homepage.component';
import { MODULE_ROUTE, ROOT_ROUTE } from '@core/models';

const routes: Routes = [
    {
        path: MODULE_ROUTE.AUTH,
        component: BaseAuthComponent,
        loadChildren: () => import('./auth/auth.module').then((p) => p.AuthModule),
    },
    {
        path: 'home',
        component: HomepageComponent,
    },
    {
        path: 'imprint',
        component: CpImprintComponent,
    },
    {
        path: 'terms',
        component: CpTermsComponent,
    },
    {
        path: 'data-protection',
        component: CpDataProtectionComponent,
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
            {
                path: ROOT_ROUTE.ACCOUNT,
                component: AccountComponent,
            },
            {
                path: MODULE_ROUTE.ENTRY,
                loadChildren: () => import('./entries/entries.module').then((p) => p.EntriesModule),
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
