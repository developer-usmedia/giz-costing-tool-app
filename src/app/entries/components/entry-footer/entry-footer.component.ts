import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { ICON } from '@shared/components/icon/icon.enum';

@Component({
    selector: 'giz-entry-footer',
    templateUrl: './entry-footer.component.html',
    styleUrl: './entry-footer.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class EntryFooterComponent {
    @Input() backButton?: {
        text: string;
        icon: ICON;
        link: string | any[];
    };
}
