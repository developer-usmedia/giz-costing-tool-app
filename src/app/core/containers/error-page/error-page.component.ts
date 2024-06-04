import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ALL_ROUTES } from '@core/models';

enum ERROR_TITLE {
    NOT_FOUND = 'Page not found',
    FORBIDDEN = 'Access forbidden',
    DEFAULT = 'Unknown Error',
}

enum ERROR_DESCRIPTION {
    NOT_FOUND = 'Oops! Looks like you hit a dead end. This page doesn\'t exist. <br /> But don\'t worry, we have a simple sitemap to help you find what you\'re looking for.',
    FORBIDDEN = 'Oops! It seems you don\'t have permission to access this page. <br /> Don\'t worry, we have a simple sitemap to help you find what you\'re looking for.',
    DEFAULT = 'Oops! Something went wrong but we do not really know what happened. Please try again later.',
}

@Component({
    selector: 'giz-error-page',
    templateUrl: './error-page.component.html',
    styleUrl: './error-page.component.scss',
})
export class ErrorPageComponent {
    protected readonly routes = ALL_ROUTES;
    protected readonly code: number;

    constructor(private readonly route: ActivatedRoute) {
        this.code = this.route.snapshot.data['error'] as number;
    }

    get title(): string {
        if (this.code === 404) {
            return ERROR_TITLE.NOT_FOUND;
        }

        if (this.code === 403) {
            return ERROR_TITLE.FORBIDDEN;
        }

        return ERROR_TITLE.DEFAULT;
    }

    get description(): string {
        if (this.code == 404) {
            return ERROR_DESCRIPTION.NOT_FOUND;
        }

        if (this.code == 403) {
            return ERROR_DESCRIPTION.FORBIDDEN;
        }

        return ERROR_DESCRIPTION.DEFAULT;
    }
}
