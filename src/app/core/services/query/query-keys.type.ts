import { PagingParams } from '@core/models';

type GetEntryKey = ['entry', { id: string }];
type GetEntriesKey = ['entries', { paging?: PagingParams }];
type GetUserKey = ['users', { id: string }];
type GetUserSessionKey = ['session'];

/* eslint-disable @typescript-eslint/semi */
export type AllQueryKeys =
    | GetEntryKey
    | GetEntriesKey
    | GetUserKey
    | GetUserSessionKey;
