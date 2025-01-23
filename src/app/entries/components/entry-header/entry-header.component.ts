import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { ICON } from '@shared/components/icon/icon.enum';
import { IconButtonComponent } from '@shared/components/icon-button/icon-button.component';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'giz-entry-header',
    templateUrl: './entry-header.component.html',
    styleUrl: './entry-header.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    imports: [IconButtonComponent, RouterLink],
})
export class EntryHeaderComponent {
    @Input() backButton?: {
        text: string;
        icon: ICON;
        link: string | any[];
    };

    @Input({required: true}) title!: string;
}
