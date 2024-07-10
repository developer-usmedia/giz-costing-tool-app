import { DistributionForm } from '@api/models/distribution.model';
import { Gender } from '@api/models/gender.enum';
import { EntityResponse, PagedResponse } from '@api/models/response.model';
import { PagingParams, Sort } from '@core/models';
import { WorkerLwDetails } from './living-wage-details.model';
import { Scenario, ScenarioSpecification } from './scenario.model';
import { WorkerRemuneration } from './worker-remuneration.model';

export type WorkerScenarioSpecification = ScenarioSpecification;
export type WorkerScenarioDistribution = ScenarioSpecification;

export interface WorkerScenario {
    specification?: WorkerScenarioSpecification;
    distribution?: {
        baseWagePerc: number;
        bonusesPerc: number;
        ikbPerc: number;
        ikbHousingPerc: number;
        ikbFoodPerc: number;
        ikbTransportPerc: number;
        ikbHealthcarePerc: number;
        ikbChildcarePerc: number;
        ikbChildEducationPerc: number;
    };
    remuneration?: {
        baseWage: number;
        bonuses: number;
        ikb: number;
        ikbHousing: number;
        ikbFood: number;
        ikbTransport: number;
        ikbHealthcare: number;
        ikbChildcare: number;
        ikbChildEducation: number;
        total: number;
    };
    livingWage?: WorkerLwDetails;
}

export interface Worker extends EntityResponse {
    id: string;
    entryId: string;
    name: string;
    gender: Gender;
    nrOfWorkers: number;
    percOfYearWorked: number;
    remuneration?: WorkerRemuneration;
    livingWage?: {
        livingWageGap: number;
        annualLivingWageGap: number;
        annualLivingWageGapAllWorkers: number;
    };
    scenario: Scenario;
}

export type WorkerListResponse = PagedResponse<'workers', Worker>;

export enum WorkersSortFilterKey {
    ID = '_id',
    CREATED_AT = '_createdAt',
    UPDATED_AT = '_updatedAt',
    NAME = '_name',
    NUMBER_OF_WORKERS = '_numberOfWorkers',
}

export interface WorkersPagingParams extends PagingParams {
    sort?: { [key in WorkersSortFilterKey]?: Sort.ASC | Sort.DESC };
    filter?: { [key in WorkersSortFilterKey]: string | number | boolean | (string | number | boolean)[] };
}

// Forms
export interface ScenarioWorkerForm {
    remunerationIncrease?: number | null;
    distribution?: DistributionForm;
}

// Mutations
export interface ScenarioWorkerUpdateMutation {
    entryId: string;
    workerId: string;
    scenarioWorkerUpdate: ScenarioWorkerForm;
}