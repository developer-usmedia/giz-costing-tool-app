import { QueryFunction, QueryOptions, injectQuery } from '@tanstack/angular-query-experimental';

import { AllQueryKeys } from '@core/services/query/query-keys.type';

export const useQuery = <TData>(
    queryKey: AllQueryKeys,
    queryFn: QueryFunction<TData>,
    ...otherProps: QueryOptions<TData>[]
) => {
    return injectQuery<TData>(() => ({
        queryKey: queryKey,
        queryFn: queryFn,
        retry: 1,
        ...otherProps,
    }));
};
