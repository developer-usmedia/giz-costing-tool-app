import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CdkMenu, CdkMenuItem } from '@angular/cdk/menu';

import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { ButtonComponent } from './components/button/button.component';
import { CdkObserveContent } from '@angular/cdk/observers';
import { CountryNamePipe } from '@shared/pipes/country-name.pipe';
import { DialogComponent } from './components/dialog/dialog.component';
import { EmptyPipe, HasErrorPipe, HasValuePipe, MarkdownPipe, ShowErrorPipe, TruncatePipe } from '@shared/pipes';
import { EntryCardComponent } from './components/entry-card/entry-card.component';
import { IconButtonComponent } from './components/icon-button/icon-button.component';
import { IconComponent } from './components/icon/icon.component';
import { LogosComponent } from './components/logos/logos.component';
import { MenuComponent } from './components/menu/menu.component';
import { MenuItemComponent } from './components/menu-item/menu-item.component';
import { PasswordStrengthComponent } from '@shared/components/password-strength/password-strength.component';
import { ScrollOverflowContainerDirective } from '@shared/directives/scroll-overflow-container.directive';
import { ScrollOverflowDirective } from '@shared/directives/scroll-overflow.directive';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { StatusComponent } from './components/status/status.component';
import { StatusPipe } from '@shared/pipes/status.pipe';
import { StepperComponent } from './components/stepper/stepper.component';
import { TabComponent } from '@shared/components/tab/tab.component';
import { TabGroupComponent } from '@shared/components/tab-group/tab-group.component';
import { VerifiedPipe } from '@shared/pipes/verifiedpipe';

const PIPES = [
    CountryNamePipe,
    EmptyPipe,
    HasErrorPipe,
    HasValuePipe,
    MarkdownPipe,
    ShowErrorPipe,
    StatusPipe,
    TruncatePipe,
    VerifiedPipe,
];

const COMPONENTS = [
    BreadcrumbComponent,
    ButtonComponent,
    DialogComponent,
    IconComponent,
    IconButtonComponent,
    MenuComponent,
    MenuItemComponent,
    PasswordStrengthComponent,
    SpinnerComponent,
    StepperComponent,
    TabGroupComponent,
    TabComponent,
];

const DIRECTIVES = [
    ScrollOverflowDirective,
    ScrollOverflowContainerDirective,
];

@NgModule({
    declarations: [
        ...COMPONENTS,
        ...PIPES,
        EntryCardComponent,
        StatusComponent,
        LogosComponent,
    ],
    exports: [
        ...COMPONENTS,
        ...DIRECTIVES,
        ...PIPES,
        EntryCardComponent,
        StatusComponent,
        LogosComponent,
    ],
    imports: [
        CommonModule,
        CdkMenu,
        CdkMenuItem,
        RouterLink,
        CdkObserveContent,
        ...DIRECTIVES,
    ],
})
export class SharedModule {
}
