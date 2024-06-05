import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';

import { PagedResponse } from '@api/models';
import { Entry } from '@api/models/entry.model';
import { BaseApi } from '@api/services/base.api';
import { environment } from 'environments/environment';
import { PagingParams } from '@core/models';
import { getHttpParamsFromPagingParams, GetParamsCodec } from '@shared/helpers';
import { HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class EntriesApi extends BaseApi {
    private readonly baseUrl = `${ environment.apiUrl }/api`;

    private readonly endpoints = {
        simulations: `${ this.baseUrl }/simulations`,
    };

    public getOne(id: string): Promise<Entry> {
        return lastValueFrom(this.get<Entry>(`${ this.endpoints.simulations }/${ id }`));
    }

    public getMany(paging?: PagingParams): Promise<PagedResponse<'simulations', Entry>> {
        let params = new HttpParams({ encoder: new GetParamsCodec() });
        if (paging) {
            params = getHttpParamsFromPagingParams(paging, params);
        }

        return lastValueFrom(
            this.get<PagedResponse<'simulations', Entry>>(this.endpoints.simulations, params)
        );
    }
}
