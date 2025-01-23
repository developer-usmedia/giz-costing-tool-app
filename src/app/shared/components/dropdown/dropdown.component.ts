import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { ICON } from '@shared/components/icon/icon.enum';
import { IconComponent } from '../icon/icon.component';

@Component({
    selector: 'giz-dropdown',
    templateUrl: './dropdown.component.html',
    styleUrl: './dropdown.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    imports: [IconComponent],
})
export class DropdownComponent {
    @Input({ required: true }) title!: string;

    protected readonly icon = ICON;
}
