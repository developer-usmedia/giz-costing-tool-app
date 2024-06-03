export interface Link {
    href: string;
    templated?: boolean;
}

export interface Pagination {
    index: number;
    size: number;
    totalEntities: number;
    totalPages: number;
}

export interface EntityResponse {
    createdAt: string;
    updatedAt: string;
    _links: {
        [key: string]: Link;
        self: Link;
    };
}

export interface PagedResponse<K extends string, E = Record<string, any>> {
    _embedded: {
        [key in K]: E[];
    };
    _links: {
        self: Link;
        first: Link;
        last: Link;
        next?: Link;
        prev?: Link;
    };
    paging: Pagination;
}
