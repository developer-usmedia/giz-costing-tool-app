import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { lastValueFrom, map } from 'rxjs';

import { User, UsersResponse, UsersResult } from '@api/models';
import { BaseApi } from './base.api';
import { PagingParams } from '@core/models';

@Injectable({ providedIn: 'root' })
export class UserApi extends BaseApi {
    private readonly baseUrl = `${environment.apiUrl}/users`;

    public getOneById(id: string): Promise<User> {
        return lastValueFrom(this.get<User>(this.baseUrl + '/' + id));
    }

    public getMany(paging: PagingParams): Promise<UsersResult> {
        const params = this.getHttpParams(paging);

        return lastValueFrom(
            this.get<UsersResponse>(this.baseUrl, params).pipe(
                map((response) => this.parsePagedResponse(response)),
            ),
        );
    }

    private parsePagedResponse(response: UsersResponse): UsersResult {
        return {
            users: response._embedded.users,
            paging: response.paging,
        };
    }
}
