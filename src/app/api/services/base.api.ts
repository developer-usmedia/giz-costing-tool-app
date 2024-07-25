import { HttpClient, HttpEvent, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { getHttpParamsFromPagingParams } from '@shared/helpers';
import { PagingParams } from '@core/models';

interface Request {
    method: 'get' | 'post' | 'patch' | 'delete';
    url: string;
    data?: unknown;
    params?: HttpParams;
}

@Injectable({ providedIn: 'root' })
export class BaseApi {
    private readonly http = inject(HttpClient);

    public isSuccessfulResponseStatus(status: number): boolean {
        return [200, 201, 202, 203, 204, 205, 206].indexOf(status) > -1;
    }

    protected getHttpParams(pagingParams: PagingParams) {
        return getHttpParamsFromPagingParams(pagingParams);
    }

    protected get<TResponse>(url: string, params?: HttpParams): Observable<TResponse> {
        return this.request<TResponse>({
            method: 'get',
            url: url,
            params: params,
        });
    }

    protected post<TResponse>(url: string, data?: unknown): Observable<TResponse> {
        return this.request<TResponse>({
            method: 'post',
            url: url,
            data: data,
        });
    }

    protected postWithProgress<TResponse>(url: string, data?: unknown): Observable<HttpEvent<TResponse>> {
        return this.requestWithProgress<TResponse>({
            method: 'post',
            url: url,
            data: data,
        });
    }

    protected patch<TResponse>(url: string, data?: unknown): Observable<TResponse> {
        return this.request<TResponse>({
            method: 'patch',
            url: url,
            data: data,
        });
    }

    protected delete<TResponse>(url: string, data?: unknown): Observable<TResponse> {
        return this.request<TResponse>({
            method: 'delete',
            url: url,
            data: data,
        });
    }

    protected request<TResponse>({ method, url, data, params }: Request): Observable<TResponse> {
        return this.http.request<TResponse>(method, url, {
            body: data,
            params: params,
        });
    }

    protected requestWithProgress<TResponse>({ method, url, data, params }: Request): Observable<HttpEvent<TResponse>> {
        return this.http.request<TResponse>(method, url, {
            body: data,
            params: params,
            reportProgress: true,
            observe: 'events',
        });
    }
}
