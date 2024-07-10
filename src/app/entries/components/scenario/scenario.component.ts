import { Dialog } from '@angular/cdk/dialog';
import { APP_BASE_HREF } from '@angular/common';
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
import { Entry, Scenario, ScenarioSpecsForm, ScenarioType, Worker, WorkerListResponse } from '@api/models';
import { MODULE_ROUTE, ScenarioInfo } from '@core/models';
import { ICON } from '@shared/components/icon/icon.enum';
import { PageEvent } from '@shared/components/paginator/paginator.model';
import {
    ResetWorkersDialogComponent,
} from '../../containers/reset-workers-dialog/reset-workers-dialog.component';
import { WorkerScenarioSpecsDialogComponent } from '../../containers/worker-scenario-specs-dialog/worker-scenario-specs-dialog.component';

@Component({
    selector: 'giz-scenario',
    templateUrl: './scenario.component.html',
    styleUrl: './scenario.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class ScenarioComponent {
    @Input({ required: true }) scenario!: ScenarioInfo;
    @Input({ required: true }) entry?: Entry;
    @Input() workers?: CreateQueryResult<WorkerListResponse, HttpErrorResponse>;
    @Input() specs?: Scenario;
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
        this.dialog.open(ResetWorkersDialogComponent, {
            data: {
                entry: this.entry,
                type: 'specifications',
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
