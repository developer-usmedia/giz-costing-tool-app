import { EntityResponse } from '@api/models/response.model';

export interface Entry extends EntityResponse {
    id: string;
    year: string;
    status: string;
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
