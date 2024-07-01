import { EntityResponse } from '@api/models/response.model';

// Entity
export enum ScenarioType {
    CLOSE_GAP = 'TYPE_CLOSE_GAP',
    ABSOLUTE_INCREASE = 'TYPE_ABSOLUTE_INCREASE',
}

export interface Scenario extends EntityResponse {
    id: string;
    type: ScenarioType;
    specifications: {
        employeeTax: number;
        employerTax: number;
        absoluteIncrease: number;
    };
}

// Forms
export interface ScenarioSpecsForm {
    employeeTax: number;
    employerTax: number;
    absoluteIncrease?: number;
}

export interface ScenarioWorkerSpecsForm {
    absoluteIncrease?: number | null;
}

export interface ScenarioCreate {
    type: ScenarioType;
    specifications?: ScenarioSpecsForm;
}

export interface ScenarioUpdate {
    specifications?: ScenarioSpecsForm;
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
