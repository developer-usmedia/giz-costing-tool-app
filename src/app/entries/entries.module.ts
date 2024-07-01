import { CdkMenuTrigger } from '@angular/cdk/menu';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CdkCopyToClipboard } from '@angular/cdk/clipboard';

import { CoreModule } from '@core/core.module';
import { ENTRY_ROUTE } from '@core/models';
import { SharedModule } from '@shared/shared.module';
import { EntryDetailComponent } from './containers/entry-detail/entry-detail.component';
import { EntryDeleteDialogComponent } from './containers/entry-delete-dialog/entry-delete-dialog.component';
import { EntryDistributionComponent } from './containers/entry-distribution/entry-distribution.component';
import { EntryInformationComponent } from './containers/entry-information/entry-information.component';
import { EntryHeaderComponent } from './components/entry-header/entry-header.component';
import { EntryScenariosComponent } from './containers/entry-scenarios/entry-scenarios.component';
import { OverviewComponent } from './containers/overview/overview.component';
import { ScenarioCardComponent } from './components/scenario-card/scenario-card.component';
import { ResetScenarioDialogComponent } from './components/reset-scenario-dialog/reset-scenario-dialog.component';
import { ScenarioComponent } from './components/scenario/scenario.component';
import { ScenarioSpecsFormComponent } from './components/scenario-specs-form/scenario-specs-form.component';
import { EntryFooterComponent } from './components/entry-footer/entry-footer.component';
import { ResetWorkersDialogComponent } from './containers/reset-workers-dialog/reset-workers-dialog.component';
import { ScenarioWorkerSpecsDialogComponent } from './containers/scenario-worker-specs-dialog/scenario-worker-specs-dialog.component';

@NgModule({
    declarations: [
        EntryDeleteDialogComponent,
        EntryDetailComponent,
        EntryDistributionComponent,
        EntryFooterComponent,
        EntryHeaderComponent,
        EntryInformationComponent,
        EntryScenariosComponent,
        OverviewComponent,
        ResetScenarioDialogComponent,
        ResetWorkersDialogComponent,
        ScenarioCardComponent,
        ScenarioComponent,
        ScenarioSpecsFormComponent,
        ScenarioWorkerSpecsDialogComponent,
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
                        component: EntryDistributionComponent,
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
        CdkMenuTrigger,
        FormsModule,
        ReactiveFormsModule,
    ],
})
export class EntriesModule {}
