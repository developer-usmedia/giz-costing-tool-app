import { EntityResponse } from '@api/models/response.model';
import { AnnualCosts } from './annual-costs';
import { FacilityLwDetails } from './living-wage-details';

// Entity
export enum ScenarioType {
    CLOSE_GAP = 'CLOSE_GAP',
    ABSOLUTE_INCREASE = 'ABSOLUTE_INCREASE',
}

export interface ScenarioSpecification {
    taxEmployee: number;
    taxEmployer: number;
    overheadCosts: number;
    remunerationIncrease: number;
}

export interface ScenarioDistribution {
    baseWagePerc: number;
    bonusesPerc: number;
    ikbPerc: number;
    ikbHousingPerc: number;
    ikbFoodPerc: number;
    ikbTransportPerc: number;
    ikbHealthcarePerc: number;
    ikbChildcarePerc: number;
    ikbChildEducationPerc: number;
}

export interface Scenario extends EntityResponse {
    type: ScenarioType;
    specification?: ScenarioSpecification;
    distribution?: ScenarioDistribution; 
    livingWage?: FacilityLwDetails;
    annualCosts?: AnnualCosts;
}

// Forms
export interface ScenarioSpecsForm {
    taxEmployee: number;
    taxEmployer: number;
    overheadCosts?: number;
    remunerationIncrease?: number;
}

export interface ScenarioDistroForm {
    bonusesPerc: number;
    ikbHousingPerc: number;
    ikbFoodPerc: number;
    ikbTransportPerc: number;
    ikbHealthcarePerc: number;
    ikbChildcarePerc: number;
    ikbChildEducationPerc: number;
}

export interface ScenarioWorkerSpecsForm {
    remunerationIncrease?: number | null;
}

export interface ScenarioCreate {
    type: ScenarioType;
    specifications: ScenarioSpecsForm;
    distributions?: ScenarioDistroForm;
}

export interface ScenarioUpdate {
    specifications?: ScenarioSpecsForm;
    distributions?: ScenarioDistroForm;
}

export interface ScenarioWorkersReset {
    reset: 'specifications' | 'distributions' | 'all';
}

// Mutations
export interface ScenarioCreateMutation {
    entryId: string;
    scenarioCreate: ScenarioCreate;
}

export interface ScenarioUpdateMutation {
    entryId: string;
    scenarioUpdate: ScenarioUpdate;
}

export interface ScenarioWorkerUpdateMutation {
    entryId: string;
    workerId: string;
    scenarioWorkerSpecsUpdate: ScenarioWorkerSpecsForm;
}

export interface ScenarioWorkersResetMutation {
    entryId: string;
    scenarioWorkersReset: ScenarioWorkersReset;
}
