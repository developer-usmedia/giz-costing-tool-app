import { CdkCopyToClipboard } from '@angular/cdk/clipboard';
import { CdkMenuTrigger } from '@angular/cdk/menu';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { GenderPipe } from '@shared/pipes';
import { NgApexchartsModule } from 'ng-apexcharts';

import { CoreModule } from '@core/core.module';
import { ENTRY_ROUTE } from '@core/models';
import { SharedModule } from '@shared/shared.module';
import { DistributionFormComponent } from './components/distribution-form/distribution-form.component';
import { EntryFooterComponent } from './components/entry-footer/entry-footer.component';
import { EntryHeaderComponent } from './components/entry-header/entry-header.component';
import { ScenarioCardComponent } from './components/scenario-card/scenario-card.component';
import { ScenarioSpecsFormComponent } from './components/scenario-specs-form/scenario-specs-form.component';
import { ScenarioComponent } from './components/scenario/scenario.component';
import { EntryBuyerComponent } from './containers/entry-buyer/entry-buyer.component';
import { EntryDeleteDialogComponent } from './containers/entry-delete-dialog/entry-delete-dialog.component';
import { EntryDetailComponent } from './containers/entry-detail/entry-detail.component';
import { EntryDistributionComponent } from './containers/entry-distribution/entry-distribution.component';
import { EntryInformationComponent } from './containers/entry-information/entry-information.component';
import { EntryReportComponent } from './containers/entry-report/entry-report.component';
import { EntryScenariosComponent } from './containers/entry-scenarios/entry-scenarios.component';
import { OverviewComponent } from './containers/overview/overview.component';
import { ResetScenarioDialogComponent } from './containers/reset-scenario-dialog/reset-scenario-dialog.component';
import { ResetWorkersDialogComponent } from './containers/reset-workers-dialog/reset-workers-dialog.component';
import { WorkerDistributionDialogComponent } from './containers/worker-distribution-dialog/worker-distribution-dialog.component';
import { WorkerScenarioSpecsDialogComponent } from './containers/worker-scenario-specs-dialog/worker-scenario-specs-dialog.component';
import { ReportWorkersChartComponent } from './components/report-workers-chart/report-workers-chart.component';

@NgModule({
    declarations: [
        DistributionFormComponent,
        EntryBuyerComponent,
        EntryDeleteDialogComponent,
        EntryDetailComponent,
        EntryDistributionComponent,
        EntryFooterComponent,
        EntryHeaderComponent,
        EntryInformationComponent,
        EntryReportComponent,
        EntryScenariosComponent,
        OverviewComponent,
        ResetScenarioDialogComponent,
        ResetWorkersDialogComponent,
        ScenarioCardComponent,
        ScenarioComponent,
        ScenarioSpecsFormComponent,
        WorkerDistributionDialogComponent,
        WorkerScenarioSpecsDialogComponent,
        ReportWorkersChartComponent,
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
                        component: EntryBuyerComponent,
                    },
                    {
                        path: ENTRY_ROUTE.REPORT,
                        component: EntryReportComponent,
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
        NgApexchartsModule,
        ReactiveFormsModule,
    ],
    providers: [
        CurrencyPipe,
        GenderPipe,
    ],
})
export class EntriesModule {}
