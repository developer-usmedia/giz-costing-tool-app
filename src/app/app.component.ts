import { Component, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
    selector: 'giz-root',
    template: '<router-outlet></router-outlet>',
    styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
    title = 'giz-costing-tool-app';

    constructor(
        @Inject(DOCUMENT) private readonly document: Document
    ) {
    }

    ngOnInit(): void {
        this.loaded();
    }

    private loaded() {
        this.document.body.classList.add('is-loaded');
    }
}
