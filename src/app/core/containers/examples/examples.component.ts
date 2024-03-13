import { Component } from '@angular/core';
import { ICON } from '@shared/models';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'giz-examples',
    templateUrl: './examples.component.html',
    styleUrl: './examples.component.scss',
})
export class ExamplesComponent {
    public icons: ICON[] = Object.entries(ICON).map(entry => entry[1]);
    protected readonly icon = ICON;

    private activeToaster?: number;

    constructor(
        private readonly toastr: ToastrService
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
}
