export class PasswordService {
    public static MINLENGTH = 9;
    public static MAXLENGTH = 15;

    public static checkUpperAndLowerCase(password: string) {
        const upper = /[A-Z]/;
        const lower = /[a-z]/;
        return upper.test(password) && lower.test(password);
    }

    public static checkForNumbers(password: string) {
        const number = /[0-9]/;
        return number.test(password);
    }

    public static checkLength(password: string) {
        return password.length >= this.MINLENGTH && password.length <= this.MAXLENGTH;
    }

    public static checkForSpecialCharacters(password: string) {
        const special = /[^A-Za-z0-9]/;
        return special.test(password);
    }
}
