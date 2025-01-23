import { Component } from '@angular/core';
import { aboutMarkdown, aboutTitle, howMarkdown, howTitle, intro } from '@core/content/dashboard-content';
import { AUTH_ROUTE, MODULE_ROUTE, ROOT_ROUTE } from '@core/models';
import { AuthService } from '@core/services';
import { DropdownComponent } from '@shared/components/dropdown/dropdown.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { RouterLink } from '@angular/router';
import { LogosComponent } from '@shared/components/logos/logos.component';
import { MarkdownPipe } from '@shared/pipes';

@Component({
    selector: 'giz-homepage',
    templateUrl: './homepage.component.html',
    styleUrl: './homepage.component.scss',
    imports: [
        DropdownComponent,
        ButtonComponent,
        RouterLink,
        LogosComponent,
        MarkdownPipe,
    ],
})
export class HomepageComponent {
    public loggedIn = this.authService.isLoggedIn();

    protected readonly moduleRoute = MODULE_ROUTE;
    protected readonly authRoute = AUTH_ROUTE;
    protected readonly rootRoute = ROOT_ROUTE;

    protected readonly aboutTitle = aboutTitle;
    protected readonly aboutMarkdown = aboutMarkdown;
    protected readonly howTitle = howTitle;
    protected readonly howMarkdown = howMarkdown;
    protected readonly intro = intro;

    constructor(
        private readonly authService: AuthService,
    ) {
    }
}
