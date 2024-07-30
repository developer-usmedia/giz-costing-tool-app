import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    HostBinding,
    Input,
    Output,
    ViewEncapsulation,
} from '@angular/core';
import { ICON } from '@shared/components/icon/icon.enum';

@Component({
    selector: 'giz-dialog',
    templateUrl: './dialog.component.html',
    styleUrl: './dialog.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogComponent {
    @Input({ required: true }) title!: string;
    @Input() intro?: string;
    @Input() showCloseButton = true;
    @Input() size: 'small' | 'normal' | 'medium' | 'large' = 'normal';
    @Input() columnSplit: 'half' | 'uneven' = 'half';

    @Output() closeDialog = new EventEmitter();

    @HostBinding('class') cssClass = 'dialog';

    public icon = ICON;

    @HostBinding('class.dialog--small') get modSmall(): boolean {
        return this.size === 'small';
    }

    @HostBinding('class.dialog--medium') get modMedium(): boolean {
        return this.size === 'medium';
    }

    @HostBinding('class.dialog--large') get modLarge(): boolean {
        return this.size === 'large';
    }

    @HostBinding('class.dialog--uneven') get modUneven(): boolean {
        return this.columnSplit === 'uneven';
    }

    public close(): void {
        this.closeDialog.emit();
    }
}
