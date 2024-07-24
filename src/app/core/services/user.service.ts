import { Injectable } from '@angular/core';

import { User } from '@api/models';
import { AuthApi } from '@api/services';
import { injectQueryClient } from '@tanstack/angular-query-experimental';
import { useQuery } from './query/use-query';

@Injectable({ providedIn: 'root' })
export class UserService {
    private readonly queryClient = injectQueryClient();

    constructor(
        private readonly authApi: AuthApi
    ){}

    public getUser() {
        return useQuery<User>(['session'], () => this.authApi.session(), { retry: false });
    }

    public refreshUser(): Promise<void> {
        return this.queryClient.invalidateQueries({ queryKey: ['session'] });
    }
}
