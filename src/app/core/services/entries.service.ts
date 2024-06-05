import { inject, Injectable } from '@angular/core';

import { Entry, PagedResponse } from '@api/models';
import { EntriesApi } from '@api/services';
import { PagingParams } from '@core/models';
import { useQuery } from './query/use-query';

@Injectable({ providedIn: 'root' })
export class EntriesService {
    private readonly entriesApi = inject(EntriesApi);

    public getEntry(id: string) {
        return useQuery<Entry>(
            ['entry', { id: id }],
            () => this.entriesApi.getOne(id),
        );
    }

    public getEntries(paging?: PagingParams) {
        return useQuery<PagedResponse<'simulations', Entry>>(
            ['entries', { paging } ],
            () => this.entriesApi.getMany(paging),
        );
    }
}
