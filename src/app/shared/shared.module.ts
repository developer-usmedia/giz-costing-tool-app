import { CdkMenu, CdkMenuItem } from '@angular/cdk/menu';
import { CdkObserveContent } from '@angular/cdk/observers';
import { CdkConnectedOverlay, CdkOverlayOrigin } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
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
import { PaginatorComponent } from '@shared/components/paginator/paginator.component';
import { PasswordStrengthComponent } from '@shared/components/password-strength/password-strength.component';
import { ProgressBarComponent } from '@shared/components/progress-bar/progress-bar.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { StatusComponent } from '@shared/components/status/status.component';
import { StepperComponent } from '@shared/components/stepper/stepper.component';
import { TabGroupComponent } from '@shared/components/tab-group/tab-group.component';
import { TabComponent } from '@shared/components/tab/tab.component';
import { TableCellComponent } from '@shared/components/table-cell/table-cell.component';
import { TableRowComponent } from '@shared/components/table-row/table-row.component';
import { TableComponent } from '@shared/components/table/table.component';
import { TooltipComponent } from '@shared/components/tooltip/tooltip.component';
import { TooltipAdvancedComponent } from '@shared/components/tooltip-advanced/tooltip-advanced.component';
import { CreateEntryDialogComponent } from '@shared/containers/create-entry-dialog/create-entry-dialog.component';
import { ScrollOverflowContainerDirective } from '@shared/directives/scroll-overflow-container.directive';
import { ScrollOverflowDirective } from '@shared/directives/scroll-overflow.directive';
import { TooltipAdvancedDirective } from '@shared/directives/tooltip-advanced.directive';
import { TooltipDirective } from '@shared/directives/tooltip.directive';
import {
    BuyerUnitPipe,
    CountryNamePipe,
    EmptyPipe,
    EntryStatusPipe,
    EntryStatusTextPipe,
    GenderPipe,
    HasErrorPipe,
    HasValuePipe,
    MarkdownPipe,
    ShowErrorPipe,
    TruncatePipe,
    VerifiedPipe,
} from '@shared/pipes';
import { AlertComponent } from './components/alert/alert.component';
import { NoResultsComponent } from './components/no-results/no-results.component';
import { FileDownloadDirective } from './directives/file-download.directive';

const PIPES = [
    BuyerUnitPipe,
    CountryNamePipe,
    EmptyPipe,
    EntryStatusPipe,
    EntryStatusTextPipe,
    GenderPipe,
    HasErrorPipe,
    HasValuePipe,
    MarkdownPipe,
    ShowErrorPipe,
    TruncatePipe,
    VerifiedPipe,
];

const COMPONENTS = [
    AlertComponent,
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
    NoResultsComponent,
    PaginatorComponent,
    PasswordStrengthComponent,
    ProgressBarComponent,
    SpinnerComponent,
    StatusComponent,
    StepperComponent,
    TabComponent,
    TabGroupComponent,
    TableComponent,
    TableRowComponent,
    TableCellComponent,
    TooltipComponent,
    TooltipAdvancedComponent,
];

const DIRECTIVES = [
    FileDownloadDirective,
    ScrollOverflowDirective,
    ScrollOverflowContainerDirective,
    TooltipDirective,
    TooltipAdvancedDirective,
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
        CdkOverlayOrigin,
        CdkConnectedOverlay,
        ReactiveFormsModule,
        ...DIRECTIVES,
    ],
})
export class SharedModule {
}
