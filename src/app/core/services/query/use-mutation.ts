import { HttpErrorResponse } from '@angular/common/http';
import { MutationFunction, MutationOptions, QueryClient, injectMutation } from '@tanstack/angular-query-experimental';

export const useMutation = <TInput, TOutput>(
    props: {
        mutationFn: MutationFunction<TOutput, TInput>;
        onSuccess?: (data: TOutput, client: QueryClient) => unknown;
        onError?: (client: QueryClient, error: Error) => unknown;
        onMutate?: (client: QueryClient) => unknown;
        onSettled?: (client: QueryClient) => unknown;
    },
    ...otherProps: MutationOptions<TInput>[]
) => {
    return injectMutation<TOutput, HttpErrorResponse, TInput>((client) => ({
        mutationFn: props.mutationFn,
        onSuccess: (data: TOutput) => (props.onSuccess ? props.onSuccess(data, client) : null),
        onError: (error) => (props.onError ? props.onError(client, error) : null),
        onMutate: () => (props.onMutate ? props.onMutate(client) : null),
        onSettled: () => (props.onSettled ? props.onSettled(client) : null),
        ...otherProps,
    }));
};
