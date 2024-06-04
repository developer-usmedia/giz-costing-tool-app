import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { ICON } from '@shared/components/icon/icon.enum';

@Component({
    selector: 'giz-entry-header',
    templateUrl: './entry-header.component.html',
    styleUrl: './entry-header.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class EntryHeaderComponent {
    @Input() backButton?: {
        text: string;
        icon: ICON;
        link: string | string[];
    };

    @Input({required: true}) title!: string;

    protected readonly icon = ICON;
}
