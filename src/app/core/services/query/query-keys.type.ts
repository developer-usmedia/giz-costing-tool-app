import { PagingParams } from '@core/models';

type GetEntryKey = ['entry', { id: string }];
type GetEntriesKey = ['entries', { paging?: PagingParams }];
type GetUserKey = ['users', { id: string }];
type GetUserSessionKey = ['session'];

export type AllQueryKeys =
    | GetEntryKey
    | GetEntriesKey
    | GetUserKey
    | GetUserSessionKey;
