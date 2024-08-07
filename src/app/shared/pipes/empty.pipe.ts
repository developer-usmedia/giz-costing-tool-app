import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'empty' })
export class EmptyPipe implements PipeTransform {
    public transform(value: undefined | null | string | number): string | number {
        if (value === '' || value === undefined || value === null) {
            return '-';
        } else {
            return value;
        }
    }
}
