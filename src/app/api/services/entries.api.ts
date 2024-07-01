import { HttpEvent, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WorkerListResponse } from '@api/models';
import { PagingParams } from '@core/models';
import { lastValueFrom, Observable } from 'rxjs';

import { EntriesListResponse, EntriesPagingParams } from '@api/models/entries.model';
import { Entry } from '@api/models/entry.model';
import { ScenarioCreate, ScenarioUpdate } from '@api/models/scenario.model';
import { BaseApi } from '@api/services/base.api';
import { getHttpParamsFromPagingParams, GetParamsCodec } from '@shared/helpers';
import { environment } from 'environments/environment';

@Injectable({ providedIn: 'root' })
export class EntriesApi extends BaseApi {
    private readonly baseUrl = `${ environment.apiUrl }/api`;

    private readonly endpoints = {
        entries: `${ this.baseUrl }/entries`,
        import: `${ this.baseUrl }/entries/import`,
        scenario: `${ this.baseUrl }/entries/:id/scenario`,
        workers: `${ this.baseUrl }/entries/:id/workers`,
    };

    public getOne(id: string): Promise<Entry> {
        return lastValueFrom(this.get<Entry>(`${ this.endpoints.entries }/${ id }`));
    }

    public getMany(paging?: EntriesPagingParams): Promise<EntriesListResponse> {
        let params = new HttpParams({ encoder: new GetParamsCodec() });

        if (paging) {
            params = getHttpParamsFromPagingParams(paging, params);
        }
        return lastValueFrom(
            this.get<EntriesListResponse>(this.endpoints.entries, params)
        );
    }

    public getWorkers(entryId: string, paging?: PagingParams): Promise<WorkerListResponse> {
        const url = this.endpoints.workers.replace(':id', entryId);
        let params = new HttpParams({ encoder: new GetParamsCodec() });
        if (paging) {
            params = getHttpParamsFromPagingParams(paging, params);
        }
        return lastValueFrom(this.get<WorkerListResponse>(url, params));
    }

    public deleteEntry(id: string): Promise<Entry> {
        return lastValueFrom(this.delete<Entry>(`${ this.endpoints.entries }/${ id }`));
    }

    public import(file: File): Observable<HttpEvent<Entry>> {
        const formData = new FormData();
        formData.append('file', file);
        return this.postWithProgress<Entry>(this.endpoints.import, formData);
    }

    public createScenario(entryId: string, scenarioCreate: ScenarioCreate) {
        const url = this.endpoints.scenario.replace(':id', entryId);
        return lastValueFrom(this.post<Entry>(url, scenarioCreate));
    }

    public updateScenario(entryId: string, scenarioUpdate: ScenarioUpdate) {
        const url = this.endpoints.scenario.replace(':id', entryId);
        return lastValueFrom(this.patch<Entry>(url, scenarioUpdate));
    }

    public deleteScenario(entryId: string) {
        const url = this.endpoints.scenario.replace(':id', entryId);
        return lastValueFrom(this.delete<Entry>(url));
    }
}
