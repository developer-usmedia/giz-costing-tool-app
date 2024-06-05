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
        staleTime: Infinity, // TODO Koen: figure out why this is out so i can explain it well to other
        ...otherProps,
    }));
};
