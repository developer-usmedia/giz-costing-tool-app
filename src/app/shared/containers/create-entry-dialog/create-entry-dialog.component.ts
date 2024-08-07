import { DialogRef } from '@angular/cdk/dialog';
import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Component, inject, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ReplaySubject, Subscription } from 'rxjs';

import { CellValidationError, Entry, ImportValidationError } from '@api/models';
import { EntriesApi } from '@api/services';
import { MODULE_ROUTE } from '@core/models';
import { EntriesService } from '@core/services';
import { ICON } from '@shared/components/icon/icon.enum';
import { STATUS } from '@shared/helpers';

export interface CreateEntryResult {
    success: boolean;
    entry?: Entry;
}

type ImportState = 'start' | 'uploading' | 'success' | 'error' | 'validation-errors';

@Component({
    selector: 'giz-create-entry-dialog',
    templateUrl: './create-entry-dialog.component.html',
    styleUrl: './create-entry-dialog.component.scss',
    encapsulation: ViewEncapsulation.None,
})
export class CreateEntryDialogComponent implements OnDestroy {
    public state: ImportState = 'start';
    public cancelled$ = new ReplaySubject<boolean>();

    protected readonly icon = ICON;
    protected readonly entriesApi = inject(EntriesApi);
    protected readonly entriesService = inject(EntriesService);

    protected file?: File;
    protected uploadSub?: Subscription;
    protected uploadProgress = 0;
    protected entry?: Entry | null;
    protected validationErrors?: ImportValidationError[];

    private readonly router = inject(Router);

    constructor(
        private readonly dialogRef: DialogRef,
    ) {
    }

    public ngOnDestroy() {
        this.reset();
    }

    public cancel() {
        this.reset();

        this.dialogRef?.close({ success: false });
    }

    public async continue() {
        await this.entriesService.refreshAllEntries();
        if (this.entry) {
            await this.router.navigate([MODULE_ROUTE.ENTRIES, this.entry?.id]);
        }

        this.dialogRef?.close({
            success: true,
            entry: this.entry,
        });
    }

    public onFileSelect(file: File) {
        this.file = file;
    }

    public uploadFile() {
        if (this.file) {
            this.state = 'uploading';

            this.entriesApi.import(this.file)
                .subscribe( {
                    next: (event) => {
                        if (event.type === HttpEventType.UploadProgress && event.total) {
                            this.uploadProgress = Math.round(100 * (event.loaded / event.total));
                        }
                        else if (event.type === HttpEventType.Response) {
                            this.entry = event.body;
                        }
                    },
                    error: (error: HttpErrorResponse) =>  {
                        /* eslint-disable @typescript-eslint/no-unsafe-member-access */
                        if (error.status === STATUS.UNPROCESSABLE && Array.isArray(error.error?.errors)
                            && (error.error.errors as ImportValidationError[]).length > 0 ) {
                            this.state = 'validation-errors';
                            this.validationErrors = error.error.errors as ImportValidationError[];
                        } else {
                            this.state = 'error';
                            console.error('An error occurred', error);
                        }
                        /* eslint-enable @typescript-eslint/no-unsafe-member-access */
                    },
                    complete: () => {
                        this.state = 'success';
                    },
                });
        }
    }

    public startOver() {
        this.reset();
        this.state = 'start';
    }

    public reset() {
        if (this.uploadSub) {
            this.uploadSub.unsubscribe();
        }
        this.cancelled$.next(true);
        this.file = undefined;
        this.uploadProgress = 0;
        this.uploadSub = undefined;
        this.entry = undefined;
        this.validationErrors = undefined;
    }

    public getTitle(state: ImportState): string {
        switch (state) {
            case 'start':
            case 'uploading':
                return $localize`:import file-upload title:Import from Salary Matrix`;
            case 'validation-errors':
                return $localize`:import validation-errors title:Issues found in file`;
            case 'error':
                return $localize`:import error title:An unexpected error occurred`;
            case 'success':
                return $localize`:import success title:File import successful`;
        }
    }

    public getMessageForErrorType(validationError: ImportValidationError): string {
        const nrRegexp = new RegExp('\\d+');
        let limit = '-';
        if (validationError.message) {
            const limitMatch = nrRegexp.exec(validationError.message);
            if (limitMatch) {
                limit = limitMatch[0].toString();
            }
        }

        switch (validationError.errorType) {
            case CellValidationError.VERSION_MISMATCH: {
                const versionRegexp = new RegExp(/Template version (\d+\.\d+\.\d+) (does not|doesn't) match supported version: (\d+\.\d+\.\d+)/);
                const versionsMatch = versionRegexp.exec(validationError.message ?? '');
                if (validationError.message && versionsMatch) {
                    const templateVersion = versionsMatch[1];
                    const supportedVersion = versionsMatch[3];
                    return $localize`:import validation-error version-mismatch:Version ${ templateVersion } is not matching supported version ${ supportedVersion }. Try to export the salary matrix again from the latest version.`;
                } else {
                    return $localize`:import validation-error version-mismatch:Version is not matching supported version. Try to export the salary matrix again from the latest version.`;
                }
            }
            case CellValidationError.MISSING_PAYROLL_SHEET:
                return $localize`:import validation-error missing-payroll-sheet:Payroll sheet is missing`;
            case CellValidationError.MISSING_INFO_SHEET:
                return $localize`:import validation-error missing-info-sheet:Info sheet is missing`;
            case CellValidationError.NUMBER_BASE:
                return $localize`:import validation-error number-base:${ validationError.property }, given value **must be a number**`;
            case CellValidationError.NUMBER_MIN:
                return $localize`:import validation-error number-min:${ validationError.property }, given value **must be greater than or equal to ${ limit }**`;
            case CellValidationError.NUMBER_MAX:
                return $localize`:import validation-error number-max:${ validationError.property }, given value **must be less than or equal to ${ limit }**`;
            case CellValidationError.STRING_BASE:
                return $localize`:import validation-error string-base:${ validationError.property }, given value **must be a string**`;
            case CellValidationError.STRING_MIN:
                return $localize`:import validation-error string-min:${ validationError.property }, given value **length must be at least ${ limit } characters long**`;
            case CellValidationError.STRING_MAX:
                return $localize`:import validation-error string-max:${ validationError.property }, given value **length must be less than or equal to ${ limit } characters long**`;
            case CellValidationError.STRING_TRIM:
                return $localize`:import validation-error string-trim:${ validationError.property }, given value **must not have leading or trailing whitespace**`;
            case CellValidationError.REQUIRED:
                return $localize`:import validation-error required:${ validationError.property }, **is required**`;
            default:
                return validationError.message || 'Unknown error';
        }
    }
}
