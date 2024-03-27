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
    RoutePipe,
    ShowErrorPipe,
    TruncatePipe,
} from '@shared/pipes';
import { MenuComponent } from './components/menu/menu.component';
import { MenuItemComponent } from './components/menu-item/menu-item.component';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';

const PIPES = [
    EmptyPipe,
    HasErrorPipe,
    HasValuePipe,
    MarkdownPipe,
    RoutePipe,
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
];

@NgModule({
    declarations: [
        ...COMPONENTS,
        ...PIPES,
    ],
    exports: [
        ...COMPONENTS,
        ...PIPES,
    ],
    imports: [
        CommonModule,
        CdkMenu,
        CdkMenuItem,
        RouterLink,
    ],
})
export class SharedModule {
}
