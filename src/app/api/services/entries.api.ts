import { HttpEvent, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom, Observable } from 'rxjs';

import { PagedResponse } from '@api/models';
import { Entry } from '@api/models/entry.model';
import { BaseApi } from '@api/services/base.api';
import { PagingParams } from '@core/models';
import { getHttpParamsFromPagingParams, GetParamsCodec } from '@shared/helpers';
import { environment } from 'environments/environment';

@Injectable({ providedIn: 'root' })
export class EntriesApi extends BaseApi {
    private readonly baseUrl = `${ environment.apiUrl }/api`;

    private readonly endpoints = {
        entries: `${ this.baseUrl }/entries`,
        import: `${ this.baseUrl }/entries/import`,
    };

    public getOne(id: string): Promise<Entry> {
        return lastValueFrom(this.get<Entry>(`${ this.endpoints.entries }/${ id }`));
    }

    public getMany(paging?: PagingParams): Promise<PagedResponse<'entries', Entry>> {
        let params = new HttpParams({ encoder: new GetParamsCodec() });
        if (paging) {
            params = getHttpParamsFromPagingParams(paging, params);
        }

        return lastValueFrom(
            this.get<PagedResponse<'entries', Entry>>(this.endpoints.entries, params)
        );
    }

    public deleteEntry(id: string): Promise<Entry> {
        return lastValueFrom(this.delete<Entry>(`${ this.endpoints.entries }/${ id }`));
    }

    public import(file: File): Observable<HttpEvent<Entry>> {
        const formData = new FormData();
        formData.append('file', file);
        return this.postWithProgress<Entry>(this.endpoints.import, formData);
    }
}
