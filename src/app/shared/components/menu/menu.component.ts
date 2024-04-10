import { ChangeDetectionStrategy, Component, HostBinding, ViewEncapsulation } from '@angular/core';
import { CdkMenu } from '@angular/cdk/menu';

@Component({
    selector: 'giz-menu',
    templateUrl: './menu.component.html',
    styleUrl: './menu.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    hostDirectives: [ CdkMenu ],
})
export class MenuComponent {
    @HostBinding('class') cssClass = 'menu';
}
