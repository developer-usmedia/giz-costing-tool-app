import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { BuyerUnit, Entry, EntryStatus } from '@api/models';
import { MODULE_ROUTE, ROOT_ROUTE } from '@core/models';

import { ICON } from '@shared/components/icon/icon.enum';
import { ToastrService } from 'ngx-toastr';
import { ButtonComponent } from '@shared/components/button/button.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IconComponent } from '@shared/components/icon/icon.component';
import { IconButtonComponent } from '@shared/components/icon-button/icon-button.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { TabGroupComponent } from '@shared/components/tab-group/tab-group.component';
import { TabComponent } from '@shared/components/tab/tab.component';
import { CdkMenuTrigger, CdkMenu, CdkMenuItem } from '@angular/cdk/menu';
import { MenuComponent } from '@shared/components/menu/menu.component';
import { MenuItemComponent } from '@shared/components/menu-item/menu-item.component';
import { TooltipDirective } from '@shared/directives/tooltip.directive';
import { TooltipAdvancedDirective } from '@shared/directives/tooltip-advanced.directive';
import { TooltipAdvancedComponent } from '@shared/components/tooltip-advanced/tooltip-advanced.component';
import { StatusComponent } from '@shared/components/status/status.component';
import { EntryCardComponent } from '@shared/components/entry-card/entry-card.component';
import { AlertComponent } from '@shared/components/alert/alert.component';
import { StepperComponent } from '@shared/components/stepper/stepper.component';
import { FileUploadComponent } from '@shared/components/file-upload/file-upload.component';
import { ProgressBarComponent } from '@shared/components/progress-bar/progress-bar.component';
import { LogosComponent } from '@shared/components/logos/logos.component';
import { PasswordStrengthComponent } from '@shared/components/password-strength/password-strength.component';
import { DialogComponent } from '@shared/components/dialog/dialog.component';

@Component({
    selector: 'giz-examples',
    templateUrl: './examples.component.html',
    styleUrl: './examples.component.scss',
    imports: [
        ButtonComponent,
        RouterLink,
        IconComponent,
        IconButtonComponent,
        SpinnerComponent,
        TabGroupComponent,
        TabComponent,
        RouterLinkActive,
        CdkMenuTrigger,
        CdkMenu,
        MenuComponent,
        CdkMenuItem,
        MenuItemComponent,
        TooltipDirective,
        TooltipAdvancedDirective,
        TooltipAdvancedComponent,
        StatusComponent,
        EntryCardComponent,
        AlertComponent,
        StepperComponent,
        FileUploadComponent,
        ProgressBarComponent,
        LogosComponent,
        PasswordStrengthComponent,
        DialogComponent,
    ],
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
            countryCode: 'BR',
            products: 'Bananas',
            production: {
                unit: BuyerUnit.UNIT,
                amount: 20000,
            },
        },
        benchmark: {
            name: '2023 - São Paulo - ORG-1',
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
                unit: BuyerUnit.PERCENTAGE,
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
