import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'giz-content-page',
    templateUrl: './content-page.component.html',
    styleUrl: './content-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentPageComponent {
}
