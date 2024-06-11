import { inject, Injectable } from '@angular/core';

import { Entry } from '@api/models';
import { EntriesListResponse, EntriesPagingParams } from '@api/models/entries.model';
import { EntriesApi } from '@api/services';
import { useMutation } from '@core/services/query/use-mutation';
import { injectQueryClient } from '@tanstack/angular-query-experimental';
import { useQuery } from './query/use-query';

@Injectable({ providedIn: 'root' })
export class EntriesService {
    private readonly entriesApi = inject(EntriesApi);
    private readonly queryClient = injectQueryClient();

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

    public deleteEntry() {
        return useMutation<string, Entry>({
            mutationFn: (id: string) => this.entriesApi.deleteEntry(id),
            onSuccess: async () => await this.refreshAllEntries(),
        });
    }

}
