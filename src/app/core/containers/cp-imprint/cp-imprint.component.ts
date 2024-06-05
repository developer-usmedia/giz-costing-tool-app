import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'giz-cp-imprint',
    templateUrl: './cp-imprint.component.html',
    styleUrl: './cp-imprint.component.scss',
})
export class CpImprintComponent implements OnInit {
    public markdown?: string;
    public loading$ = new BehaviorSubject<boolean>(true);

    constructor(
        @Inject(LOCALE_ID) public currentLocale: string,
        @Inject(APP_BASE_HREF) public baseHref: string,
        private readonly http: HttpClient,
        private readonly toastr: ToastrService,
    ) {
    }

    public ngOnInit() {
        const file = `${ this.baseHref }assets/markdown/imprint-${ this.currentLocale }.md`;
        this.http.get(file, { responseType: 'text' }).subscribe({
            next: (response) => {
                this.markdown = response;
                this.loading$.next(false);
            },
            error: (error: HttpErrorResponse) => {
                this.toastr.error($localize`:content load error:Failed to get markdown file`, error.message);
                console.error(error);
            },
        });
    }
}
