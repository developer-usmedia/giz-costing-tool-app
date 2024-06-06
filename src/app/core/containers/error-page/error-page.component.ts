import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ALL_ROUTES } from '@core/models';
import { AuthService } from '@core/services';

@Component({
    selector: 'giz-error-page',
    templateUrl: './error-page.component.html',
    styleUrl: './error-page.component.scss',
})
export class ErrorPageComponent {
    public readonly loggedIn = this.authService.isLoggedIn();
    protected readonly routes = ALL_ROUTES;
    protected readonly code: number;

    constructor(
        private readonly authService: AuthService,
        private readonly route: ActivatedRoute,
    ) {
        this.code = this.route.snapshot.data['error'] as number;
    }

    get title(): string {
        if (this.code === 404) {
            return $localize`:error title not-found:Page not found`;
        }
        else if (this.code === 403) {
            return $localize`:error title forbidden:Access forbidden`;
        }

        return $localize`:error title unknown:Unknown error`;
    }

    get description(): string {
        if (this.code == 404) {
            return $localize`:error description not-found:Oops! Looks like you hit a dead end. This page doesn't exist.
            \ But don't worry, we have a simple sitemap to help you find what you're looking for.`;
        }
        else if (this.code == 403) {
            return $localize`:error description not-found:Oops! It seems you don't have permission to access this page.
            \ Don't worry, we have a simple sitemap to help you find what you're looking for.`;
        }

        return $localize`:error description not-found:Oops! Something went wrong but we do not really know what happened. Please try again later.`;
    }
}
