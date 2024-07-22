import { Component, HostBinding, Inject, ViewEncapsulation } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';

@Component({
    selector: 'giz-base-auth',
    templateUrl: './base-auth.component.html',
    styleUrl: './base-auth.component.scss',
    encapsulation: ViewEncapsulation.None,
})
export class BaseAuthComponent {
   @HostBinding('class') cssClass = 'bass-auth';

   public backgroundImage = 'auth-background.jpg';
   public backgroundCopyright = 'GIZGmbH';

   constructor(
       @Inject(APP_BASE_HREF) public baseHref: string,
   ) {}
}
