import { Pipe, PipeTransform } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Pipe({ name: 'hasValue', pure: false })
export class HasValuePipe implements PipeTransform {
    transform(
        form: FormGroup,
        name: string | string[],
    ): boolean {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const value: any = form.get(name)?.value;
        return (value !== '' && value !== undefined && value !== null);
    }
}
