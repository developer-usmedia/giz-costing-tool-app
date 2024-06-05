import { Injectable } from '@angular/core';

import { User } from '@api/models';
import { AuthApi, UserApi } from '@api/services';
import { useQuery } from './query/use-query';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(
        private readonly userApi: UserApi,
        private readonly authApi: AuthApi
    ){}

    public getUser(id: string) {
        return useQuery<User>(['users', { id: id }], () => this.userApi.getOneById(id));
    }

    public getUserSession() {
        return useQuery<User>(['session'], () => this.authApi.session(), { retry: false });
    }
}
