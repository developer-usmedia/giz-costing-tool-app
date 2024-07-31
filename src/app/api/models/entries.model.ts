import { Entry } from '@api/models/entry.model';
import { PagedResponse } from '@api/models/response.model';
import { PagingParams, Sort } from '@core/models';

export type EntriesListResponse = PagedResponse<'entries', Entry>;

export enum EntrySortFilterKey {
    ID = '_id',
    CREATED_AT = '_createdAt',
    UPDATED_AT = '_updatedAt',
    VERSION = '_version',
    MATRIXID = '_matrixId',
    YEAR = 'payroll__year',
    STATUS = '_status',
    FACILITY_NAME = 'facility__name',
}

export interface EntriesPagingParams extends PagingParams {
    sort?: { [key in EntrySortFilterKey]?: (Sort.ASC | Sort.DESC) };
    filter?: { [key in EntrySortFilterKey]: string | number | boolean | (string | number | boolean)[] };
}

export const defaultEntriesSortKey = EntrySortFilterKey.UPDATED_AT;
