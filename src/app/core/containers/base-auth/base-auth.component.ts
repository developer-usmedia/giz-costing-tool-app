import { Component, HostBinding, Inject, LOCALE_ID, ViewEncapsulation } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';

@Component({
    selector: 'giz-base-auth',
    templateUrl: './base-auth.component.html',
    styleUrl: './base-auth.component.scss',
    encapsulation: ViewEncapsulation.None,
})
export class BaseAuthComponent {
   @HostBinding('class') cssClass = 'bass-auth';

   constructor(
       @Inject(APP_BASE_HREF) public baseHref: string,
   ) {}
}
