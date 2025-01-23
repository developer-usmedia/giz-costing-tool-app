import { Dialog } from '@angular/cdk/dialog';
import { APP_BASE_HREF, NgClass, CurrencyPipe, KeyValuePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    inject,
    Inject,
    Input,
    Output,
    ViewEncapsulation,
} from '@angular/core';
import { CreateQueryResult } from '@tanstack/angular-query-experimental';

import { determineWageIncrease } from '@api/helpers/worker.helper';
import { Entry, ScenarioSpecsForm, ScenarioType, Worker, WorkerListResponse } from '@api/models';
import { MODULE_ROUTE, ScenarioInfo } from '@core/models';
import { ICON } from '@shared/components/icon/icon.enum';
import { PageEvent } from '@shared/components/paginator/paginator.model';
import {
    ResetWorkersData,
    ResetWorkersDialogComponent, ResetWorkersResult,
} from '../../containers/reset-workers-dialog/reset-workers-dialog.component';
import { WorkerScenarioSpecsDialogComponent } from '../../containers/worker-scenario-specs-dialog/worker-scenario-specs-dialog.component';
import { ScenarioSpecsFormComponent } from '../scenario-specs-form/scenario-specs-form.component';
import { TableComponent } from '@shared/components/table/table.component';
import { TableRowComponent } from '@shared/components/table-row/table-row.component';
import { TableCellComponent } from '@shared/components/table-cell/table-cell.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { IconButtonComponent } from '@shared/components/icon-button/icon-button.component';
import { PaginatorComponent } from '@shared/components/paginator/paginator.component';
import { NoResultsComponent } from '@shared/components/no-results/no-results.component';
import { EmptyPipe, GenderPipe, MarkdownPipe } from '@shared/pipes';

@Component({
    selector: 'giz-scenario',
    templateUrl: './scenario.component.html',
    styleUrl: './scenario.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    imports: [
        NgClass,
        ScenarioSpecsFormComponent,
        TableComponent,
        TableRowComponent,
        TableCellComponent,
        ButtonComponent,
        SpinnerComponent,
        IconButtonComponent,
        PaginatorComponent,
        NoResultsComponent,
        CurrencyPipe,
        KeyValuePipe,
        EmptyPipe,
        GenderPipe,
        MarkdownPipe,
    ],
})
export class ScenarioComponent {
    @Input({ required: true }) scenario!: ScenarioInfo;
    @Input({ required: true }) entry?: Entry;
    @Input() workers?: CreateQueryResult<WorkerListResponse, HttpErrorResponse>;
    @Input() saving?: boolean;
    @Input() state?: 'edit' | 'view' = 'edit';

    @Output() readonly pagingUpdated = new EventEmitter<PageEvent>();
    @Output() readonly submitSpecs = new EventEmitter<ScenarioSpecsForm>();

    protected readonly icon = ICON;
    protected readonly moduleRoute = MODULE_ROUTE;
    protected readonly scenarioType = ScenarioType;

    private readonly dialog = inject(Dialog);

    constructor(
        @Inject(APP_BASE_HREF) public baseHref: string,
    ) {
    }

    get currencyCode(): string {
        return this.entry?.payroll?.currencyCode ?? '';
    }

    public getTableCaptionSpecs() {
        return $localize`:specs title:Specifications`;
    }

    public getWageIncrease(worker: Worker) {
        if(!this.entry) {
            return 0;
        }
        return determineWageIncrease(worker, this.entry );
    }

    public onSubmitSpecs(scenarioForm: ScenarioSpecsForm) {
        this.submitSpecs.emit(scenarioForm);
    }

    public edit(worker: Worker) {
        this.dialog.open(WorkerScenarioSpecsDialogComponent, {
            data: {
                entry: this.entry,
                worker: worker,
            },
        });
    }

    public resetAll() {
        this.dialog.open<ResetWorkersResult, ResetWorkersData, ResetWorkersDialogComponent>(ResetWorkersDialogComponent, {
            data: {
                entry: this.entry,
                type: 'specification',
            },
        });
    }

    public onPageEvent(pageEvent: PageEvent): void {
        this.pagingUpdated.emit(pageEvent);
    }

    public getTableCaption(total?: number) {
        return $localize`:job-categories table:${ total ?? '-' } job categories`;
    }
}
