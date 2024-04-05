import { Component, HostBinding, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'giz-base-auth',
    templateUrl: './base-auth.component.html',
    styleUrl: './base-auth.component.scss',
    encapsulation: ViewEncapsulation.None,
})
export class BaseAuthComponent {
   @HostBinding('class') cssClass = 'bass-auth';
}
