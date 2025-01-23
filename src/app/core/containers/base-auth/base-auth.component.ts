import { Component, HostBinding, Inject, ViewEncapsulation } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
    selector: 'giz-base-auth',
    templateUrl: './base-auth.component.html',
    styleUrl: './base-auth.component.scss',
    encapsulation: ViewEncapsulation.None,
    imports: [RouterOutlet, FooterComponent],
})
export class BaseAuthComponent {
   @HostBinding('class') cssClass = 'bass-auth';

   public backgroundImage = 'auth-background.jpg';
   public backgroundCopyright = 'GIZGmbH';

   constructor(
       @Inject(APP_BASE_HREF) public baseHref: string,
   ) {}
}
