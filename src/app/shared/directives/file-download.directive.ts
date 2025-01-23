import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Directive, EventEmitter, HostBinding, HostListener, inject, Input, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';

@Directive({ selector: '[gizFileDownload]' })
export class FileDownloadDirective {
    @Input({ alias: 'gizFileDownload', required: true })
    downloadUrl = '';

    @Input()
    errorMessage: string = $localize`:file-download error:Something went wrong downloading this file`;

    @Input()
    fallbackFileName = 'file';

    @Input()
    @HostBinding('disabled')
    disabled: boolean | null = null;

    @Output() loading = new EventEmitter<boolean>();

    private readonly httpClient = inject(HttpClient);
    private readonly toastr = inject(ToastrService);

    @HostListener('click')
    public async onClick(): Promise<void> {
        if (this.disabled || !this.downloadUrl) {
            return;
        }

        // API downloads are protected, so we are downloading the document as a blob via the httpClient
        const request$ = this.httpClient.get(this.downloadUrl, { responseType: 'blob', observe: 'response' });

        // After download, simulate a normal download-click
        this.disabled = true;
        this.loading.emit(true);
        await firstValueFrom(request$)
            .then((response) => {
                if (response.ok) {
                    this.simulateDownloadViaClick(response);
                }
            })
            .catch((_) => {
                this.toastr.error(this.errorMessage);
            })
            .finally(() => {
                this.disabled = false;
                this.loading.emit(false);
            });
    }

    private simulateDownloadViaClick(response: HttpResponse<Blob>): void {
        if (!response.body) {
            throw new Error('Cannot open empty blob');
        }

        const url = URL.createObjectURL(response.body);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = this.getFilenameFromHeaders(response.headers) || this.fallbackFileName;
        anchor.click();

        // Discard the object data and anchor tag
        anchor.remove();
        URL.revokeObjectURL(url);
    }

    /*
     * StackOverflow is full of RegEx-es for parsing the content-disposition header,
     * but that's overkill for my purposes, since we have a known back-end with predictable behaviour.
     * We can afford to assume that the content-disposition header looks like the example in the docs
     * https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition
     *
     * In other words, it'll be something like this:
     *    Content-Disposition: attachment; filename="filename.ext"
     *
     * We should probably allow for single and double quotes (or no quotes) around the filename.
     * That said we don't need to worry about character-encoding since all the filenames
     * we generate on the server side should be vanilla ASCII.
     */
    private getFilenameFromHeaders(headers: HttpHeaders): string | undefined {
        // The content-disposition header should include a suggested filename for the file
        const contentDisposition = headers.get('Content-Disposition');
        if (!contentDisposition) {
            return undefined;
        }

        // Split hard on 'filename='
        const value = contentDisposition.split('filename=').at(1);
        if (!value) {
            return undefined;
        }

        // And then return trimmed value, ie. remove whitespace, " ' characters from the beginning and end of the value
        const trimmedValue = value.trim().replace(/^["']/, '').replace(/["']$/, '');
        return trimmedValue.length > 0 ? trimmedValue : undefined;
    }
}
