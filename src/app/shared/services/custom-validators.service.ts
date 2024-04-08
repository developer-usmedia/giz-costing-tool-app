import { AbstractControl, ValidationErrors } from '@angular/forms';
import { PasswordService } from '@shared/services/password.service';

export class CustomValidators {
    static matchPassword(control: AbstractControl): ValidationErrors | null {
        const password = String(control.get('password')?.value);
        const confirmPassword = String(control.get('passwordConfirm')?.value);
        const inValid = password !== '' && confirmPassword !== '' && password !== confirmPassword;
        return inValid ? { noMatch: true } : null;
    }

    public static passwordLength(control: AbstractControl): ValidationErrors | null {
        if (control.value === '' || control.value === null) {
            return null;
        }

        const value = control.value as string;
        const isValid = PasswordService.checkLength(value);

        return isValid ? null : { passwordLength: { valid: false, value: value } };
    }

    public static passwordUpperAndLowerCase(control: AbstractControl): ValidationErrors | null {
        if (control.value === '' || control.value === null) {
            return null;
        }

        const value = control.value as string;
        const isValid = PasswordService.checkUpperAndLowerCase(value);

        return isValid ? null : { passwordUpperAndLowerCase: { valid: false, value: value } };
    }

    public static passwordNumbers(control: AbstractControl): ValidationErrors | null {
        if (control.value === '' || control.value === null) {
            return null;
        }

        const value = control.value as string;
        const isValid = PasswordService.checkForNumbers(value);

        return isValid ? null : { passwordNumbers: { valid: false, value: value } };
    }

    public static passwordSpecialCharacters(control: AbstractControl): ValidationErrors | null {
        if (control.value === '' || control.value === null) {
            return null;
        }

        const value = control.value as string;
        const isValid = PasswordService.checkForSpecialCharacters(value);

        return isValid ? null : { passwordSpecialCharacters: { valid: false, value: value } };
    }

    public static phone(control: AbstractControl): ValidationErrors | null {
        if (control.value === '' || control.value === null) {
            return null;
        }

        const value = (control.value as string);
        const isValid = /^((\+31)|(0031)|(0))[1-9]{1}[0-9]{8}$/i.test(value);

        return isValid ? null : { phone: { valid: false, value: value } };
    }

    public static postcode(control: AbstractControl): ValidationErrors | null {
        if (control.value === '' || control.value === null) {
            return null;
        }

        const value = (control.value as string);
        const isValid = /^[1-9][0-9]{3} ?(?!SA|SD|SS)[A-Z]{2}$/i.test(value);

        return isValid ? null : { postcode: { valid: false, value: value } };
    }
}