export enum Sort {
    ASC = 'ASC',
    DESC = 'DESC',
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
