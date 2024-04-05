import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ButtonComponent } from './components/button/button.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { IconButtonComponent } from './components/icon-button/icon-button.component';
import { IconComponent } from './components/icon/icon.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { StepperComponent } from './components/stepper/stepper.component';
import { EmptyPipe, HasErrorPipe, HasValuePipe, RoutePipe, ShowErrorPipe, TruncatePipe } from '@shared/pipes';
import { PasswordStrengthComponent } from '@shared/components/password-strength/password-strength.component';

const PIPES = [
    EmptyPipe,
    HasErrorPipe,
    HasValuePipe,
    ShowErrorPipe,
    RoutePipe,
    TruncatePipe,
];

const COMPONENTS = [
    ButtonComponent,
    DialogComponent,
    IconComponent,
    IconButtonComponent,
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
        TranslateModule,
    ],
})
export class SharedModule {
}
