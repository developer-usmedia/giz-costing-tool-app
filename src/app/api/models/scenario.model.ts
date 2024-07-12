import { Distribution, DistributionForm } from '@api/models/distribution.model';
import { AnnualCosts } from './annual-costs.model';
import { FacilityLwDetails } from './living-wage-details.model';

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

export interface Scenario {
    type: ScenarioType;
    specification?: ScenarioSpecification;
    distribution?: Distribution;
    livingWage?: FacilityLwDetails;
    annualCosts?: AnnualCosts;
}

// Forms
export interface ScenarioSpecsForm {
    taxEmployee: number;
    taxEmployer: number;
    overheadCosts: number;
    remunerationIncrease: number;
}

export interface ScenarioCreate {
    type: ScenarioType;
    specifications: ScenarioSpecsForm;
    distributions?: DistributionForm;
}

export interface ScenarioUpdate {
    specifications?: ScenarioSpecsForm;
    distributions?: DistributionForm;
}

export interface ScenarioWorkersReset {
    type: 'specification' | 'distribution' | 'all';
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

export interface ScenarioWorkersResetMutation {
    entryId: string;
    scenarioWorkersReset: ScenarioWorkersReset;
}
