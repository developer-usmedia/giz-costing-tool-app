import { coerceNumberProperty } from '@angular/cdk/coercion';
import { HttpParameterCodec, HttpParams } from '@angular/common/http';
import { Params } from '@angular/router';
import { EntrySortFilterKey } from '@api/models';
import { PageFilter, PageSort, PagingParams, Sort } from '@core/models';

/**
 * Creating a default codec for get-params. The default from angular doesn't fully encode all chars
 *
 * @see https://github.com/angular/angular/blame/f8096d499324cf0961f092944bbaedd05364eea1/packages/common/http/src/params.ts#L59
 */
export class GetParamsCodec implements HttpParameterCodec {
    encodeKey = (key: string): string => encodeURIComponent(key);
    encodeValue = (value: string): string => encodeURIComponent(value);
    decodeKey = (key: string): string => decodeURIComponent(key);
    decodeValue = (value: string): string => decodeURIComponent(value);
}

/**
 * Converts the PagingParams to HttpParams which HttpClient accepts
 * @param paging params to convert
 * @param params optional base
 * @returns HttpParams
 */
export const getHttpParamsFromPagingParams = (paging: PagingParams, params?: HttpParams): HttpParams => {
    if (!params) {
        params = new HttpParams({ encoder: new GetParamsCodec() });
    }

    if (paging.index) {
        params = params.set('index', paging.index.toString());
    }

    if (paging.size) {
        params = params.set('size', paging.size.toString());
    }

    if (paging.sort) {
        for (const [attr, sort] of Object.entries(paging.sort)) {
            params = params.append('sort', `${attr},${sort}`);
        }
    }

    if (paging.filter) {
        for (const [attr, value] of Object.entries(paging.filter)) {
            if (Array.isArray(value)) {
                const filters = value.map(item => String(item));
                params = params.set(attr, filters.join(','));
            } else if (value !== undefined && value !== null && value !== '') {
                params = params.set(attr, String(value));
            }
        }
    }

    return params;
};


/**
 * Converts the PagingParams to Params which the router accepts
 * @param paging params to convert
 * @param params optional base
 * @returns Params
 */
export const getParamsFromPagingParams = <T extends PagingParams>(paging: T, params?: URLSearchParams): Params => {
    if (!params) {
        params = new URLSearchParams();
    }

    if (paging.index) {
       params.set('index', paging.index.toString());
    }

    if (paging.size) {
        params.set('size', paging.size.toString());
    }

    if (paging.sort) {
        for (const [attr, sort] of Object.entries(paging.sort)) {
            params.append('sort', `${attr},${sort}`);
        }
    }

    if (paging.filter) {
        for (const [attr, value] of Object.entries(paging.filter)) {
            if (Array.isArray(value)) {
                const filters = value.map(item => String(item));
                params.set(attr, filters.join(','));
            } else if (value !== undefined && value !== null && value !== '') {
                params.set(attr, String(value));
            }
        }
    }

    const result: Record<string, any> = {};
    for (const [key, value] of params.entries()) {
        result[key] = value;
    }
    return result;
};


export const getPageSortFromSearchParams = (params: URLSearchParams): PageSort => {
    const sort: PageSort = {};

    if (params.has('sort')) {
        const sortParams = params.getAll('sort');

        for (const param of sortParams) {
            const [ attr, order ] = param.split(',');

            if (attr && order) {
                sort[ attr ] = (order.toLowerCase() === 'desc' ? Sort.DESC : Sort.ASC);
            }
        }
    }

    return sort;
};

export const getPageFiltersFromSearchParams = (params: URLSearchParams): PageFilter => {
    const filters: PageFilter = {};

    for (const key of params.keys()) {
        if ([ 'index', 'size', 'sort' ].indexOf(key) === -1) {
            const rawValues = params.getAll(key);

            if (!rawValues || 0 === rawValues.length) {
                break;
            }

            const values = rawValues.map(value => {
                // convert to boolean
                if (value === 'true' || value === 'false') {
                    return (value === 'true');
                }

                // +param tries to convert it to a number
                return (isNaN(+value) ? value : +value);
            });

            filters[ key ] = (values.length === 1 ? values[ 0 ] : values);
        }
    }

    return filters;
};

export const getDefaultSize = (type?: string): number => {
    switch (type) {
        case 'workers':
            return 50;
        default:
            return 10;
    }
};

export const getDefaultSort = (type?: string): PageSort => {
    switch (type) {
        case 'entries':
            return { [EntrySortFilterKey.UPDATED_AT]: Sort.DESC };
        default:
            return {};
    }
};

export const getPagingParamsFromQueryParams = <T extends PagingParams>(queryParams: Params, type?: string): T => {
    const searchParams = new URLSearchParams(queryParams);
    const sort = getPageSortFromSearchParams(searchParams);
    return {
        index: Math.max(coerceNumberProperty(searchParams.get('index')) - 1, 0),
        size: coerceNumberProperty(searchParams.get('size')) || getDefaultSize(type),
        sort: Object.keys(sort).length > 0 ? sort : getDefaultSort(type),
        filter: getPageFiltersFromSearchParams(searchParams),
    } as T;
};

