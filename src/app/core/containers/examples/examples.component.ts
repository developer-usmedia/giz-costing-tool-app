import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { Entry, EntryStatus } from '@api/models';
import { MODULE_ROUTE, ROOT_ROUTE } from '@core/models';

import { ICON } from '@shared/components/icon/icon.enum';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'giz-examples',
    templateUrl: './examples.component.html',
    styleUrl: './examples.component.scss',
})
export class ExamplesComponent {
    @ViewChild('dialogTemplateRef') private readonly dialogTemplateRef!: TemplateRef<any>;

    public icons: ICON[] = Object.entries(ICON).map(entry => entry[1]);
    public entry: Entry = {
        id: 'bd101a34-0438-4065-b84c-a4efc7258204',
        year: '2023',
        administrativeCosts: 200,
        defaultEmployerTax: 3,
        defaultEmployeeTax: 5,
        nrOfJobcategories: 45,
        nrOfWorkers: 200,
        nrOfWorkersBelowLW: 120,
        status: EntryStatus.OPEN,
        createdAt: '2023-11-05',
        updatedAt: '2023-29-05',
        averageLwGap: 200,
        largestLwGap: 400,
        scenario: null,
        facility: {
            id: 'BRMASO-0002',
            name: 'Facility Name',
            country: 'Brazil',
            countryCode: 'BR',
            currencyCode: 'BRL',
            product: 'Bananas',
            unitOfProduction: 'Box',
            annualProduction: 200000,
            buyerName: 'Lidl',
            buyerProportion: 50,
        },
        benchmark: {
            year: '2023',
            source: 'source',
            region: 'São Paulo',
            locality: 'Rural',
            localValue: 462,
            currencyCode:'BRL',
            currencyName: 'Brazilian Real',
        },
        _links: {
            self: {
                href: '/',
            },
        },
    };

    protected readonly routes = ROOT_ROUTE;
    protected readonly moduleRoute = MODULE_ROUTE;
    protected readonly icon = ICON;

    private activeToaster?: number;
    private dialogRef?: DialogRef<any>;

    constructor(
        public dialog: Dialog,
        private readonly toastr: ToastrService,
    ) {
    }

    public showToaster(type: 'info' | 'success' | 'warning' | 'error' | 'warning-filled' | 'critical') {
        switch (type) {
            case 'info':
                this.toastr.info('Toast message', 'Toast info');
                break;

            case 'success':
                this.toastr.success('Toast message', 'Toast success');
                break;

            case 'warning':
                this.toastr.warning('Toast message', 'Toast warning');
                break;

            case 'error':
                this.toastr.error('Toast message', 'Toast error');
                break;

            case 'warning-filled':
                this.toastr.warning('Toast message', 'Toast warning (filled)',
                    { toastClass: 'toast toast--filled' });
                break;

            case 'critical':
                this.toastr.error('Toast message', 'Toast error/critical (filled)',
                    { toastClass: 'toast toast--filled' });
                break;
        }
    }

    public showNonCloseableToaster() {
        const toastr = this.toastr.error('Toast message', 'Toast won\'t close automatically', {
            disableTimeOut: true,
        });
        this.activeToaster = toastr.toastId;
    }

    public closeToaster() {
        if (this.activeToaster) {
            this.toastr.clear(this.activeToaster);
            this.activeToaster = undefined;
        }
    }

    public openDialog() {
        this.dialogRef = this.dialog.open(this.dialogTemplateRef);
    }

    public closeDialog() {
        this.dialogRef?.close();
    }
}
