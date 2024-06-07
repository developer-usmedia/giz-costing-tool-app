import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    HostBinding,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { ICON } from '@shared/components/icon/icon.enum';

@Component({
    selector: 'giz-file-upload',
    templateUrl: './file-upload.component.html',
    styleUrl: './file-upload.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileUploadComponent implements OnChanges {
    @Input() allowedExtensions?: string[];
    @Input() inProgress = false;
    @Input() progress = 0;
    @Input() cancel = false;

    @Output() fileSelected = new EventEmitter<File>();

    @HostBinding('class') cssClass = 'file-upload';

    @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;

    public fileName?: string;
    protected readonly icon = ICON;

    public ngOnChanges(changes: SimpleChanges) {
        if (changes['cancel'] && !!changes['cancel'].currentValue) {
            this.fileName = '';
            if (this.fileInput?.nativeElement) {
                this.fileInput.nativeElement.value = '';
            }
        }
    }

    public onFileSelected() {
        const file: File | null = this.fileInput?.nativeElement?.files ? this.fileInput?.nativeElement.files[0] : null;
        if (file) {
            this.fileSelected.emit(file);
            this.fileName = file.name;
        }
    }
}
