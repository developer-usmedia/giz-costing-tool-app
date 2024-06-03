export enum Sort {
    ASC = 'asc',
    DESC = 'desc',
}

export interface PageSort {
    [key: string]: Sort.ASC | Sort.DESC;
}

export interface PageFilter {
    [key: string]: string | number | boolean | (string | number | boolean)[];
}

export interface PagingParams {
    index: number;
    size: number;
    sort?: PageSort;
    filter?: PageFilter;
}