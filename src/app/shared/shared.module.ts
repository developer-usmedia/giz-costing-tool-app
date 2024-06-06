import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CdkMenu, CdkMenuItem } from '@angular/cdk/menu';

import { ButtonComponent } from './components/button/button.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { IconButtonComponent } from './components/icon-button/icon-button.component';
import { IconComponent } from './components/icon/icon.component';
import { PasswordStrengthComponent } from '@shared/components/password-strength/password-strength.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { StepperComponent } from './components/stepper/stepper.component';
import {
    EmptyPipe,
    HasErrorPipe,
    HasValuePipe,
    MarkdownPipe,
    ShowErrorPipe,
    TruncatePipe,
} from '@shared/pipes';
import { MenuComponent } from './components/menu/menu.component';
import { MenuItemComponent } from './components/menu-item/menu-item.component';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { TabGroupComponent } from '@shared/components/tab-group/tab-group.component';
import { TabComponent } from '@shared/components/tab/tab.component';
import { CdkObserveContent } from '@angular/cdk/observers';
import { ScrollOverflowDirective } from '@shared/directives/scroll-overflow.directive';
import { ScrollOverflowContainerDirective } from '@shared/directives/scroll-overflow-container.directive';
import { EntryCardComponent } from './components/entry-card/entry-card.component';
import { StatusComponent } from './components/status/status.component';
import { LogosComponent } from './components/logos/logos.component';

const PIPES = [
    EmptyPipe,
    HasErrorPipe,
    HasValuePipe,
    MarkdownPipe,
    ShowErrorPipe,
    TruncatePipe,
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
