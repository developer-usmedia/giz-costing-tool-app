import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
    public cookieName = 'GIZ-COOKIE';

    public isLoggedIn(): boolean {
        return document.cookie.includes(this.cookieName);
    }
}
