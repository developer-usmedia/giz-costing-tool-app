import { EntityResponse } from '@api/models/response.model';
import { Scenario } from '@api/models/scenario.model';
import { FacilityLwDetails } from './living-wage-details';

export interface Entry extends EntityResponse {
    id: string;
    status: EntryStatus;
    facility: {
        id?: string;
        name: string;
        country: string;
        products: string;
        production: {
            unit: string;
            amount: number;
        };
    };
    matrix?: {
        id: string;
        verified: number;
    };
    payroll: {
        year: string;
        currencyCode: string;
        nrOfJobCategories: number;
        nrOfWorkers: number;
    };
    benchmark: {
        year: string;
        source: string;
        region: string;
        locality: string;
        value: number;
    };
    livingWage?: FacilityLwDetails;
    buyer?: {
        name: string;
        proportion: {
            amount: number;
            unit: string;
        };
        annualCosts?: {
            remunerationIncrease: number;
            taxCosts: number;
            additionalCosts: number;
            totalCosts: number;
            totalCostsPerUnit: number;
        };
    };
    scenario?: Scenario;
}

export enum EntryStatus {
    CREATED = 'CREATED',              // Grey
    INFO_DONE = 'INFO_DONE',          // Yellow
    PAYROLL_DONE = 'PAYROLL_DONE',
    SCENARIO_DONE = 'SCENARIO_DONE',  // Blue
    DISTRIBUTION_DONE = 'DISTRIBUTION_DONE',
    COMPLETED = 'COMPLETED',          // Green
}

export enum CellValidationError {
    MISSING_INFO_SHEET = 'MISSING_INFO_SHEET',
    MISSING_PAYROLL_SHEET = 'MISSING_PAYROLL_SHEET',
    VERSION_MISMATCH = 'VERSION_MISMATCH',
    NUMBER_BASE = 'number.base',
    NUMBER_MIN = 'number.min',
    NUMBER_MAX = 'number.max',
    STRING_BASE = 'string.base',
    STRING_MIN = 'string.min',
    STRING_MAX = 'string.max',
    STRING_TRIM = 'string.trim',
    REQUIRED = 'any.required',
}

export interface ImportValidationError {
    sheetIndex?: number;
    rowIndex?: number;
    column?: string;
    property?: string;
    message?: string;
    value?: string;
    errorType: CellValidationError;
}
