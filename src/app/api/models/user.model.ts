import { EntityResponse, PagedResponse, Pagination } from '@api/models/response.model';

export interface User extends EntityResponse {
    id: string;
    email: string;
    emailVerified: boolean;
    passwordCreatedAt: string;
    twoFactorEnabled: boolean;
}

export interface UserResponse {
    user: User;
}

export interface UsersResponse extends PagedResponse<'users'> {
    _embedded: {
        users: User[];
    };
}

export interface UsersResult {
    users: User[];
    paging: Pagination;
}
