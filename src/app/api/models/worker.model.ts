import { Gender } from '@api/models/gender.enum';
import { EntityResponse, PagedResponse } from '@api/models/response.model';
import { PagingParams, Sort } from '@core/models';

export interface Worker extends EntityResponse {
    id: string;
    entryId: string;
    name: string;
    gender: Gender;
    numberOfWorkers: number;
    monthlyWage: number;
    monthlyBonus: number;
    percentageOfYearWorked: number;
    employeeTax: number;
    employerTax: number;
    livingWageGap: number;
    absoluteIncrease?: number;
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
    sort?: { [key in WorkersSortFilterKey]?: (Sort.ASC | Sort.DESC) };
    filter?: { [key in WorkersSortFilterKey]: string | number | boolean | (string | number | boolean)[] };
}
