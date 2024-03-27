import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BaseComponent } from '@core/containers/base/base.component';
import { DashboardComponent } from '@core/containers/dashboard/dashboard.component';
import { ErrorPageComponent } from '@core/containers/error-page/error-page.component';
import { ExamplesComponent } from '@core/containers/examples/examples.component';
import { RootRoutingGuard } from '@shared/guards/root-routing.guard';

const ROUTES_EN: Routes = [
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
];

const ROUTES_ES: Routes = [
    {
        path: '',
        redirectTo: 'panel',
        pathMatch: 'full',
    },
    {
        path: 'ejemplos',
        component: ExamplesComponent,
    },
    {
        path: 'panel',
        component: DashboardComponent,
    },
];

const routes: Routes = [
    {
        path: '',
        children: [],
        canActivate: [
            // TODO: This can be replaced with a function itself in angular v18.
            // https://github.com/angular/angular/blob/main/CHANGELOG.md#routers
            // When upgrading to angular v18 please delete guard and use the function itself
            RootRoutingGuard,
        ],
        pathMatch: 'full',
    },
    { path: 'en', component: BaseComponent, children: ROUTES_EN },
    { path: 'es', component: BaseComponent, children: ROUTES_ES },

    { path: 'error/404', component: ErrorPageComponent, data: { error: 404 } },
    { path: 'error/500', component: ErrorPageComponent, data: { error: 500 } },
    { path: '**', redirectTo: 'error/404' },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes,  { anchorScrolling: 'enabled', scrollOffset: [0, 50] }),
    ],
    exports: [ RouterModule ],
})
export class AppRoutingModule {}
