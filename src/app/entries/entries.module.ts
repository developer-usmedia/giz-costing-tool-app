import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CdkCopyToClipboard } from '@angular/cdk/clipboard';

import { CoreModule } from '@core/core.module';
import { ENTRY_ROUTE } from '@core/models';
import { SharedModule } from '@shared/shared.module';
import { EntryDetailComponent } from './containers/entry-detail/entry-detail.component';
import { EntryDeleteDialogComponent } from './containers/entry-delete-dialog/entry-delete-dialog.component';
import { EntryInformationComponent } from './containers/entry-information/entry-information.component';
import { EntryHeaderComponent } from './components/entry-header/entry-header.component';
import { EntryScenariosComponent } from './containers/entry-scenarios/entry-scenarios.component';
import { OverviewComponent } from './containers/overview/overview.component';

@NgModule({
    declarations: [
        EntryDetailComponent,
        EntryDeleteDialogComponent,
        EntryHeaderComponent,
        EntryInformationComponent,
        EntryScenariosComponent,
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
                        path: '',
                        component: EntryInformationComponent,
                    },
                    {
                        path: ENTRY_ROUTE.SCENARIO,
                        component: EntryScenariosComponent,
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
        CdkCopyToClipboard,
    ],
})
export class EntriesModule {}
