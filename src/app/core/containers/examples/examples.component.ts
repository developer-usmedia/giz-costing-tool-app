import { Component } from '@angular/core';
import { ICON } from '@shared/models';

@Component({
    selector: 'giz-examples',
    templateUrl: './examples.component.html',
    styleUrl: './examples.component.scss',
})
export class ExamplesComponent {
    public icons: ICON[] = Object.entries(ICON).map(entry => entry[1]);
    protected readonly icon = ICON;
}
