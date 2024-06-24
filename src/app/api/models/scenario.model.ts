import { EntityResponse } from '@api/models/response.model';

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
export interface ScenarioSpecsForm {
    employeeTax: number;
    employerTax: number;
    absoluteIncrease?: number;
}

export interface ScenarioCreate {
    type: ScenarioType;
    specifications?: ScenarioSpecsForm;
}

export interface ScenarioUpdate {
    specifications?: ScenarioSpecsForm;
}

export interface ScenarioCreateMutation {
    entryId: string;
    scenarioCreate: ScenarioCreate;
}

export interface ScenarioUpdateMutation {
    entryId: string;
    scenarioUpdate: ScenarioUpdate;
}
