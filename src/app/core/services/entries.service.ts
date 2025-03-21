import { inject, Injectable } from '@angular/core';
import { QueryClient } from '@tanstack/angular-query-experimental';

import {
    EntriesListResponse,
    EntriesPagingParams,
    Entry,
    EntryUpdateMutation,
    ScenarioCreateMutation,
    ScenarioUpdateMutation,
    ScenarioWorkersResetMutation,
    ScenarioWorkerUpdateMutation,
    Worker,
    WorkerListResponse,
} from '@api/models';
import { EntriesApi } from '@api/services';
import { useMutation } from '@core/services/query/use-mutation';
import { useQuery } from './query/use-query';

@Injectable({ providedIn: 'root' })
export class EntriesService {
    private readonly entriesApi = inject(EntriesApi);
    private readonly queryClient = inject(QueryClient);

    public getEntry(id: string) {
        return useQuery<Entry>(
            ['entry', { id: id }],
            () => this.entriesApi.getOne(id),
        );
    }

    public getEntries(paging?: EntriesPagingParams) {
        return useQuery<EntriesListResponse>(
            ['entries', { paging }],
            () => this.entriesApi.getMany(paging),
        );
    }

    public refreshAllEntries(): Promise<void> {
        return this.queryClient.invalidateQueries({ queryKey: ['entries'] });
    }

    public refreshEntry(id: string): Promise<void> {
        return this.queryClient.invalidateQueries({ queryKey: ['entry', { id: id }] });
    }

    public refreshWorkers(entryId: string): Promise<void> {
        return this.queryClient.invalidateQueries({ queryKey: ['workers', { id: entryId }] });
    }

    public updateEntry() {
        return useMutation<EntryUpdateMutation, Entry>({
            mutationFn: (form: EntryUpdateMutation) => {
                return this.entriesApi.updateEntry(form.entryId, form.entryUpdate);
            },
        });
    }

    public deleteEntry() {
        return useMutation<string, Entry>({
            mutationFn: (id: string) => this.entriesApi.deleteEntry(id),
            onSuccess: async () => await this.refreshAllEntries(),
        });
    }

    public createScenario() {
        return useMutation<ScenarioCreateMutation, Entry>({
            mutationFn: (mutation: ScenarioCreateMutation) => {
                return this.entriesApi.createScenario(mutation.entryId, mutation.scenarioCreate);
            },
            onSuccess: async (entry: Entry, mutation: ScenarioCreateMutation) => {
                await this.refreshEntry(entry.id);
                await this.refreshWorkers(mutation.entryId);
            },
        });
    }

    public updateScenario() {
        return useMutation<ScenarioUpdateMutation, Entry>({
            mutationFn: (mutation: ScenarioUpdateMutation) => {
                return this.entriesApi.updateScenario(mutation.entryId, mutation.scenarioUpdate);
            },
        });
    }

    public deleteScenarioSpecs() {
        return useMutation<string, Entry>({
            mutationFn: (entryId: string) => {
                return this.entriesApi.deleteScenario(entryId);
            },
            onSuccess: async (entry: Entry) => await this.refreshEntry(entry.id),
        });
    }

    public updateScenarioWorker() {
        return useMutation<ScenarioWorkerUpdateMutation, Worker>({
            mutationFn: (mutation: ScenarioWorkerUpdateMutation) => {
                return this.entriesApi.updateScenarioWorker(mutation.entryId, mutation.workerId, mutation.scenarioWorkerUpdate);
            },
            onSuccess: async (worker: Worker) => {
                await this.refreshWorkers(worker.entryId);
                await this.refreshEntry(worker.entryId);
            },
        });
    }

    public resetScenarioWorkers() {
        return useMutation<ScenarioWorkersResetMutation, WorkerListResponse>({
            mutationFn: (mutation: ScenarioWorkersResetMutation) => {
                return this.entriesApi.resetScenarioWorkers(mutation.entryId, mutation.scenarioWorkersReset);
            },
            onSuccess: async (_data, mutation) => await this.refreshWorkers(mutation.entryId),
        });
    }
}
