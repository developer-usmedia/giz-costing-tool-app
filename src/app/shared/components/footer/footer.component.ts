import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ICON } from '@shared/components/icon/icon.enum';

@Component({
    selector: 'giz-footer',
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {
    protected readonly icon = ICON;
}
