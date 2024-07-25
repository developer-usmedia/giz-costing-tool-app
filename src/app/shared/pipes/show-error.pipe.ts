import { Pipe, PipeTransform } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Pipe({ name: 'showError', pure: false })
export class ShowErrorPipe implements PipeTransform {
    transform(
        form: FormGroup,
        name: string | string[],
        errorCode: string
    ): boolean {
        const control = form.get(name);
        return (!!control?.invalid) && (control.dirty && control.touched) && control.hasError(errorCode);
    }
}
