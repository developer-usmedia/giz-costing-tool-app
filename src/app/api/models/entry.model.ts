import { EntityResponse } from '@api/models/response.model';

export interface Entry extends EntityResponse {
    id: string;
    year: string;
    status: EntryStatus;
    administrativeCosts: number;
    defaultEmployerTax: number;
    defaultEmployeeTax: number;
    nrOfJobcategories: number;
    nrOfWorkers: number;
    nrOfWorkersBelowLW: number;
    facility: Facility;
    benchmark: Benchmark;
    matrixId?: string;
    verified?: boolean;
}

export interface Facility {
    id: string;
    name: string;
    country: string;
    countryCode: string;
    currencyCode: string;
    product: string;
    unitOfProduction: string;
    annualProduction: number;
    buyerName: string;
    buyerProportion: number;
}

export interface Benchmark {
    year: string;
    source: string;
    locality: string;
    region: string;
    currencyCode: string;
    currencyName: string;
    localValue: number;
}

export enum EntryStatus {
    OPEN = 'STATUS_OPEN',
    FINALIZED = 'STATUS_FINALIZED',
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

