import { CdkMenu, CdkMenuItem } from '@angular/cdk/menu';
import { CdkObserveContent } from '@angular/cdk/observers';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { DialogComponent } from '@shared/components/dialog/dialog.component';
import { EntryCardComponent } from '@shared/components/entry-card/entry-card.component';
import { FileUploadComponent } from '@shared/components/file-upload/file-upload.component';
import { IconButtonComponent } from '@shared/components/icon-button/icon-button.component';
import { IconComponent } from '@shared/components/icon/icon.component';
import { LogosComponent } from '@shared/components/logos/logos.component';
import { MenuItemComponent } from '@shared/components/menu-item/menu-item.component';
import { MenuComponent } from '@shared/components/menu/menu.component';
import { PasswordStrengthComponent } from '@shared/components/password-strength/password-strength.component';
import { ProgressBarComponent } from '@shared/components/progress-bar/progress-bar.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { StatusComponent } from '@shared/components/status/status.component';
import { StepperComponent } from '@shared/components/stepper/stepper.component';
import { TabGroupComponent } from '@shared/components/tab-group/tab-group.component';
import { TabComponent } from '@shared/components/tab/tab.component';
import { CreateEntryDialogComponent } from '@shared/containers/create-entry-dialog/create-entry-dialog.component';
import { ScrollOverflowContainerDirective } from '@shared/directives/scroll-overflow-container.directive';
import { ScrollOverflowDirective } from '@shared/directives/scroll-overflow.directive';
import { EmptyPipe, HasErrorPipe, HasValuePipe, MarkdownPipe, ShowErrorPipe, TruncatePipe } from '@shared/pipes';
import { CountryNamePipe } from '@shared/pipes/country-name.pipe';
import { StatusPipe } from '@shared/pipes/status.pipe';
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
    CreateEntryDialogComponent,
    DialogComponent,
    EntryCardComponent,
    FileUploadComponent,
    IconButtonComponent,
    IconComponent,
    LogosComponent,
    MenuComponent,
    MenuItemComponent,
    PasswordStrengthComponent,
    ProgressBarComponent,
    SpinnerComponent,
    StatusComponent,
    StepperComponent,
    TabComponent,
    TabGroupComponent,
];

const DIRECTIVES = [
    ScrollOverflowDirective,
    ScrollOverflowContainerDirective,
];

@NgModule({
    declarations: [
        ...COMPONENTS,
        ...PIPES,

    ],
    exports: [
        ...COMPONENTS,
        ...DIRECTIVES,
        ...PIPES,
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
