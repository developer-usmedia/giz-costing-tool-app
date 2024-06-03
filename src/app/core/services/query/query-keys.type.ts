type GetUserKey = ['users', { id: string }];
type GetUserSession = ['session'];

/* eslint-disable @typescript-eslint/semi */
export type AllQueryKeys =
    | GetUserKey
    | GetUserSession;
