import { HttpErrorResponse } from '@angular/common/http';
import { MutationFunction, MutationOptions, injectMutation } from '@tanstack/angular-query-experimental';

export const useMutation = <TInput, TOutput>(
    props: {
        mutationFn: MutationFunction<TOutput, TInput>;
        onSuccess?: (data: TOutput, mutation: TInput) => unknown;
        onError?: (error: Error) => unknown;
        onMutate?: () => unknown;
        onSettled?: () => unknown;
    },
    ...otherProps: MutationOptions<TInput>[]
) => {
    return injectMutation<TOutput, HttpErrorResponse, TInput>(() => ({
        mutationFn: props.mutationFn,
        onSuccess: (data: TOutput, mutation: TInput) => (props.onSuccess ? props.onSuccess(data, mutation) : null),
        onError: (error) => (props.onError ? props.onError(error) : null),
        onMutate: () => (props.onMutate ? props.onMutate() : null),
        onSettled: () => (props.onSettled ? props.onSettled() : null),
        ...otherProps,
    }));
};
