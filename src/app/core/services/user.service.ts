import { Injectable } from '@angular/core';

import { AuthApi } from '@api/services';
import { UserApi } from './api/user.api';
import { useQuery } from './query/use-query';
import { UserResponse } from '@api/models';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(
        private readonly userApi: UserApi,
        private readonly authApi: AuthApi
    ){}

    public getUser(id: string) {
        return useQuery<UserResponse>(['users', { id: id }], () => this.userApi.getOneById(id));
    }

    public getUserSession() {
        return useQuery<UserResponse>(['session'], () => this.authApi.session(), { retry: false });
    }
}
