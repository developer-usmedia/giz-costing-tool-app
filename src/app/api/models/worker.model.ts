import { Distribution, DistributionForm } from '@api/models/distribution.model';
import { Gender } from '@api/models/gender.enum';
import { EntityResponse, PagedResponse } from '@api/models/response.model';
import { PagingParams, Sort } from '@core/models';
import { WorkerLwDetails } from './living-wage-details.model';
import { ScenarioSpecification } from './scenario.model';
import { WorkerRemuneration } from './worker-remuneration.model';

export interface WorkerScenario {
    specification?: ScenarioSpecification;
    distribution?: Distribution;
    livingWage?: WorkerLwDetails;
    remuneration?: WorkerRemuneration;
}

export interface Worker extends EntityResponse {
    id: string;
    entryId: string;
    name: string;
    gender: Gender;
    nrOfWorkers: number;
    percOfYearWorked: number;
    remuneration?: WorkerRemuneration;
    livingWage?: WorkerLwDetails;
    scenario: WorkerScenario;
}

export type WorkerListResponse = PagedResponse<'workers', Worker>;

export enum WorkersSortFilterKey {
    ID = '_id',
    CREATED_AT = '_createdAt',
    UPDATED_AT = '_updatedAt',
    NAME = '_name',
    NUMBER_OF_WORKERS = '_nrOfWorkers',
}

export interface WorkersPagingParams extends PagingParams {
    sort?: { [key in WorkersSortFilterKey]?: Sort.ASC | Sort.DESC };
    filter?: { [key in WorkersSortFilterKey]: string | number | boolean | (string | number | boolean)[] };
}

// Forms
export interface ScenarioWorkerForm {
    remunerationIncrease?: number | null;
    distribution?: DistributionForm | null;
}

// Mutations
export interface ScenarioWorkerUpdateMutation {
    entryId: string;
    workerId: string;
    scenarioWorkerUpdate: ScenarioWorkerForm;
}
