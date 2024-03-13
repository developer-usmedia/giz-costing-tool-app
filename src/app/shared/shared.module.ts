import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { EmptyPipe } from '@shared/pipes/empty.pipe';
import { TruncatePipe } from '@shared/pipes/truncate.pipe';
import { ButtonComponent } from './components/button/button.component';
import { IconComponent } from './components/icon/icon.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { IconButtonComponent } from './components/icon-button/icon-button.component';
import { DialogComponent } from './components/dialog/dialog.component';

const PIPES = [
    EmptyPipe,
    TruncatePipe,
];

const COMPONENTS = [
    ButtonComponent,
    DialogComponent,
    IconComponent,
    IconButtonComponent,
    SpinnerComponent,
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
