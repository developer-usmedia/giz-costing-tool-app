import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AccountComponent } from '@core/containers/account/account.component';
import { BaseAuthComponent } from '@core/containers/base-auth/base-auth.component';
import { BaseContentComponent } from '@core/containers/base-content/base-content.component';
import { BaseComponent } from '@core/containers/base/base.component';
import { CpDataProtectionComponent } from '@core/containers/cp-data-protection/cp-data-protection.component';
import { CpImprintComponent } from '@core/containers/cp-imprint/cp-imprint.component';
import { CpTermsComponent } from '@core/containers/cp-terms/cp-terms.component';
import { DashboardComponent } from '@core/containers/dashboard/dashboard.component';
import { ErrorPageComponent } from '@core/containers/error-page/error-page.component';
import { ExamplesComponent } from '@core/containers/examples/examples.component';
import { HomepageComponent } from '@core/containers/homepage/homepage.component';
import { AuthGuard } from '@core/guards/auth.guard';
import { MODULE_ROUTE, ROOT_ROUTE } from '@core/models';

const routes: Routes = [
    {
        path: '',
        component: BaseContentComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                component: HomepageComponent,
            },
            {
                path: ROOT_ROUTE.IMPRINT.replace(/\//g, ''),
                component: CpImprintComponent,
            },
            {
                path: ROOT_ROUTE.TERMS.replace(/\//g, ''),
                component: CpTermsComponent,
            },
            {
                path: ROOT_ROUTE.DATA_PROTECTION.replace(/\//g, ''),
                component: CpDataProtectionComponent,
            },
        ],
    },
    {
        path: MODULE_ROUTE.AUTH.replace(/\//g, ''),
        component: BaseAuthComponent,
        loadChildren: () => import('./auth/auth.module').then((p) => p.AuthModule),
    },
    {
        path: '',
        component: BaseComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: ROOT_ROUTE.DASHBOARD.replace(/\//g, ''),
                component: DashboardComponent,
            },
            {
                path: ROOT_ROUTE.EXAMPLES.replace(/\//g, ''),
                component: ExamplesComponent,
            },
            {
                path: ROOT_ROUTE.ACCOUNT.replace(/\//g, ''),
                component: AccountComponent,
            },
            {
                path: MODULE_ROUTE.ENTRIES.replace(/\//g, ''),
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
