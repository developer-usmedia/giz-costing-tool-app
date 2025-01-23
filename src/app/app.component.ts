import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { AngularQueryDevtools } from '@tanstack/angular-query-devtools-experimental';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'giz-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [AngularQueryDevtools, RouterOutlet],
})
export class AppComponent implements OnInit {
    protected readonly devTools = environment.devTools;

    constructor(
        @Inject(DOCUMENT) private readonly document: Document,
    ) {
    }

    public ngOnInit(): void {
        this.loaded();
    }

    private loaded() {
        this.document.body.classList.add('is-loaded');
    }
}
