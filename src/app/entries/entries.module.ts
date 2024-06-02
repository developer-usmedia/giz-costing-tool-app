import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CoreModule } from '@core/core.module';
import { ENTRY_ROUTE } from '@core/models';
import { SharedModule } from '@shared/shared.module';
import { EntryDetailComponent } from './containers/entry-detail/entry-detail.component';
import { OverviewComponent } from './containers/overview/overview.component';
import { EntryInformationComponent } from './containers/entry-information/entry-information.component';

@NgModule({
    declarations: [
        EntryDetailComponent,
        EntryInformationComponent,
        OverviewComponent,
    ],
    imports: [
        HttpClientModule,
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
                        path: ENTRY_ROUTE.INFORMATION,
                        component: EntryInformationComponent,
                    },
                    {
                        path: ENTRY_ROUTE.SCENARIO,
                        component: EntryInformationComponent,
                    },
                    {
                        path: ENTRY_ROUTE.DISTRIBUTION,
                        component: EntryInformationComponent,
                    },
                    {
                        path: ENTRY_ROUTE.BUYER,
                        component: EntryInformationComponent,
                    },
                    {
                        path: ENTRY_ROUTE.REPORT,
                        component: EntryInformationComponent,
                    },
                ],
            },
        ]),
        CommonModule,
        CoreModule,
        SharedModule,
    ],
})
export class EntriesModule {}
