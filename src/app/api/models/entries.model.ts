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
    YEAR = '_year',
    USER = '_user',
    STATUS = '_status',
    FACILITY_NAME = 'facility_name',
    FACILITY_ID = 'facility_id',
    FACILITY_COUNTRYCODE = 'facility_countryCode',
    FACILITY_CURRENCYCODE = 'facility_currencyCode',
    FACILITY_PRODUCT = 'facility_product',
    FACILITY_UNITOFPRODUCTION = 'facility_unitOfProduction',
    FACILITY_ANNUALPRODUCTION = 'facility_annualProduction',
    FACILITY_BUYERNAME = 'facility_buyerName',
    FACILITY_BUYERPROPORTION = 'facility_buyerProportion',
    BENCHMARK_NAME = 'benchmark_name',
    BENCHMARK_YEAR = 'benchmark_year',
    BENCHMARK_SOURCE = 'benchmark_source',
    BENCHMARK_REGION = 'benchmark_region',
    BENCHMARK_CURRENCYCODE = 'benchmark_currencyCode',
    BENCHMARK_CURRENCYNAME = 'benchmark_currencyName',
    BENCHMARK_LOCALVALUE = 'benchmark_localValue',
    WORKERS = '_workers',
    DEFAULTEMPLOYERTAX = '_defaultEmployerTax',
    DEFAULTEMPLOYEETAX = '_defaultEmployeeTax',
    ADMINISTRATIVECOSTS = '_administrativeCosts',
}

export interface EntriesPagingParams extends PagingParams {
    sort?: { [key in EntrySortFilterKey]?: (Sort.ASC | Sort.DESC) };
    filter?: { [key in EntrySortFilterKey]: string | number | boolean | (string | number | boolean)[] };
}

export const defaultEntriesSortKey = EntrySortFilterKey.UPDATED_AT;
