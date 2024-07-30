import { Pipe, PipeTransform } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Pipe({ name: 'hasError', pure: false })
export class HasErrorPipe implements PipeTransform {
    transform(
        form: FormGroup,
        name: string | string[],
        validationName?: string
    ): boolean {
        const control = form.get(name);
        const isInvalid = !!control?.invalid;
        const touched = !!control?.touched;
        // When validationName is given check for that validation, otherwise use overall invalid on field
        const hasValidationError = !!(validationName ? control?.hasError(validationName) : isInvalid);
        return isInvalid && touched && hasValidationError;
    }
}
