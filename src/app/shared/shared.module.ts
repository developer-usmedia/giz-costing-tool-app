import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmptyPipe } from '@shared/pipes/empty.pipe';
import { TruncatePipe } from '@shared/pipes/truncate.pipe';
import { ButtonComponent } from './components/button/button.component';
import { IconComponent } from './components/icon/icon.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { IconButtonComponent } from './components/icon-button/icon-button.component';

const PIPES = [
    EmptyPipe,
    TruncatePipe,
];

const COMPONENTS = [
    ButtonComponent,
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
    ],
})
export class SharedModule {
}
