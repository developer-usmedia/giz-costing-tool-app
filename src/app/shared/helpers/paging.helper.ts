import { HttpParameterCodec, HttpParams } from '@angular/common/http';
import { PagingParams } from '@core/models';

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
