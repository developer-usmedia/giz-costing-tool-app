import { ChangeDetectionStrategy, Component, HostBinding, Input, ViewEncapsulation } from '@angular/core';
import { ICON } from '@shared/components/icon/icon.enum';
import { Status } from '@shared/components/status/status.type';

@Component({
    selector: 'giz-status',
    templateUrl: './status.component.html',
    styleUrl: './status.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class StatusComponent {
    @Input({ required: true }) status!: Status;

    @HostBinding('class') cssClass = 'status';

    protected readonly icon = ICON;

    @HostBinding('class.status--empty') get modEmpty(): boolean {
        return this.status === 'empty';
    }

    @HostBinding('class.status--started') get modStarted(): boolean {
        return this.status === 'started';
    }

    @HostBinding('class.status--ongoing') get modOngoing(): boolean {
        return this.status === 'ongoing';
    }

    @HostBinding('class.status--done') get modDone(): boolean {
        return this.status === 'done';
    }
}
