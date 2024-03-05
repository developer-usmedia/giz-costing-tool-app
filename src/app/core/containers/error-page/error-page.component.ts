import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'giz-error-page',
    templateUrl: './error-page.component.html',
    styleUrl: './error-page.component.scss',
})
export class ErrorPageComponent {
    constructor(
        private readonly route: ActivatedRoute
    ) {}

    get code(): string {
        return (this.route.snapshot.data['error'] as string) || '??';
    }
}
