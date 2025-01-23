import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { ICON } from '@shared/components/icon/icon.enum';
import { IconButtonComponent } from '@shared/components/icon-button/icon-button.component';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'giz-entry-footer',
    templateUrl: './entry-footer.component.html',
    styleUrl: './entry-footer.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    imports: [IconButtonComponent, RouterLink],
})
export class EntryFooterComponent {
    @Input() backButton?: {
        text: string;
        icon: ICON;
        link: string | any[];
    };
}
