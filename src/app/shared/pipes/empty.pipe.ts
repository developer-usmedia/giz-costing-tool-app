import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'empty' })
export class EmptyPipe implements PipeTransform {
    public transform(value: string | number): string | number {
        if (value === '' || value === undefined || value === null || value === 0) {
            return '-';
        } else {
            return value;
        }
    }
}
