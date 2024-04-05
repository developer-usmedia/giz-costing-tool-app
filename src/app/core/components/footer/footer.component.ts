import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

import { ICON } from '@shared/components/icon/icon.enum';

@Component({
    selector: 'giz-footer',
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class FooterComponent {
    @Input() theme: 'default' | 'white' = 'default';

    protected readonly icon = ICON;
}
