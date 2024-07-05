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
        status: EntryStatus.INFO_DONE,
        createdAt: '2023-11-05',
        updatedAt: '2023-29-05',
        facility: {
            id: 'BRMASO-0002',
            name: 'Facility Name',
            country: 'Brazil',
            products: 'Bananas',
            production: {
                unit: 'Box',
                amount: 20000,
            },
        },
        benchmark: {
            year: '2023',
            source: 'source',
            region: 'São Paulo',
            locality: 'Rural',
            value: 462,
        },
        matrix: {
            id: '137fab',
            verified: 200,
        },
        livingWage: {
            nrOfWorkersBelowLivingWage: 25,
            avgLivingWageGap: 25,
            largestLivingWageGap: 25,
            annualFacilityLivingWageGap: 25,
        },
        payroll: {
            year: '2023',
            currencyCode: 'BLR',
            nrOfJobCategories: 40,
            nrOfWorkers: 600,
        },
        buyer: {
            name: 'Lidl',
            proportion: {
                amount: 50,
                unit: 'percentage',
            },
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
