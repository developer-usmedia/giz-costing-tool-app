import { HttpEvent, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, lastValueFrom } from 'rxjs';

import {
    ScenarioWorkerForm,
    ScenarioWorkersReset,
    Worker,
    WorkerListResponse,
} from '@api/models';
import { EntriesListResponse, EntriesPagingParams } from '@api/models/entries.model';
import { Entry, EntryUpdateForm } from '@api/models/entry.model';
import { ScenarioCreate, ScenarioUpdate } from '@api/models/scenario.model';
import { BaseApi } from '@api/services/base.api';
import { PagingParams } from '@core/models';
import { GetParamsCodec, getHttpParamsFromPagingParams } from '@shared/helpers';
import { environment } from 'environments/environment';

@Injectable({ providedIn: 'root' })
export class EntriesApi extends BaseApi {
    private readonly baseUrl = `${ environment.apiUrl }/api`;

    private readonly endpoints = {
        entries: `${ this.baseUrl }/entries`,
        import: `${ this.baseUrl }/entries/import`,
        scenario: `${ this.baseUrl }/entries/:id/scenario`,
        workers: `${ this.baseUrl }/entries/:id/workers`,
        workersReset: `${ this.baseUrl }/entries/:id/workers/reset`,
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

    public updateEntry(id: string, updateForm: EntryUpdateForm): Promise<Entry> {
        return lastValueFrom(this.patch<Entry>(`${ this.endpoints.entries }/${ id }`, updateForm));
    }
    
    public deleteEntry(id: string): Promise<Entry> {
        return lastValueFrom(this.delete<Entry>(`${ this.endpoints.entries }/${ id }`));
    }

    public getWorkers(entryId: string, paging?: PagingParams): Promise<WorkerListResponse> {
        const url = this.endpoints.workers.replace(':id', entryId);
        let params = new HttpParams({ encoder: new GetParamsCodec() });
        if (paging) {
            params = getHttpParamsFromPagingParams(paging, params);
        }
        return lastValueFrom(this.get<WorkerListResponse>(url, params));
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

    public updateScenarioWorker(entryId: string, workerId: string, workerForm: ScenarioWorkerForm) {
        const url = `${this.endpoints.workers.replace(':id', entryId) }/${ workerId }`;
        return lastValueFrom(this.patch<Worker>(url, workerForm));
    }

    public resetScenarioWorkers(entryId: string, reset: ScenarioWorkersReset) {
        const url = `${this.endpoints.workersReset.replace(':id', entryId) }`;
        return lastValueFrom(this.post<WorkerListResponse>(url, reset));
    }

}
