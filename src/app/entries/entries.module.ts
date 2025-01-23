import { CurrencyPipe } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GenderPipe } from '@shared/pipes';
import { ENTRY_ROUTE } from '@core/models';

import { EntryBuyerComponent } from './containers/entry-buyer/entry-buyer.component';
import { EntryDetailComponent } from './containers/entry-detail/entry-detail.component';
import { EntryDistributionComponent } from './containers/entry-distribution/entry-distribution.component';
import { EntryInformationComponent } from './containers/entry-information/entry-information.component';
import { EntryReportComponent } from './containers/entry-report/entry-report.component';
import { EntryScenariosComponent } from './containers/entry-scenarios/entry-scenarios.component';
import { OverviewComponent } from './containers/overview/overview.component';


@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: OverviewComponent,
            },
            {
                path: ':id',
                component: EntryDetailComponent,
                children: [
                    {
                        path: '',
                        component: EntryInformationComponent,
                    },
                    {
                        path: ENTRY_ROUTE.SCENARIO,
                        component: EntryScenariosComponent,
                    },
                    {
                        path: ENTRY_ROUTE.DISTRIBUTION,
                        component: EntryDistributionComponent,
                    },
                    {
                        path: ENTRY_ROUTE.BUYER,
                        component: EntryBuyerComponent,
                    },
                    {
                        path: ENTRY_ROUTE.REPORT,
                        component: EntryReportComponent,
                    },
                ],
            },
        ]),
    ],
    providers: [
        CurrencyPipe,
        GenderPipe,
        provideHttpClient(withInterceptorsFromDi()),
    ],
})
export class EntriesModule {}
