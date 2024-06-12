import { inject, Injectable } from '@angular/core';

import { Entry, PagedResponse } from '@api/models';
import { EntriesApi } from '@api/services';
import { PagingParams } from '@core/models';
import { useQuery } from './query/use-query';
import { injectQueryClient } from '@tanstack/angular-query-experimental';
import { useMutation } from '@core/services/query/use-mutation';

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

    public getEntries(paging?: PagingParams) {
        return useQuery<PagedResponse<'entries', Entry>>(
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
