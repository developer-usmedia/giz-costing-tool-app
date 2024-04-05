import { Pipe, PipeTransform } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Pipe({ name: 'hasError', pure: false })
export class HasErrorPipe implements PipeTransform {
    transform(
        form: FormGroup,
        name: string | string[],
    ): boolean {
        const control = form.get(name);
        return (!!control?.invalid) && (control.dirty || control.touched);
    }
}
