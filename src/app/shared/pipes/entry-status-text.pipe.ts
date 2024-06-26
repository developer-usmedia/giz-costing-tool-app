import { Pipe, PipeTransform } from '@angular/core';
import { EntryStatus } from '@api/models';

@Pipe({ name: 'entryStatusText' })
export class EntryStatusTextPipe implements PipeTransform {
    public transform(status: EntryStatus): string {
        switch (status) {
            case EntryStatus.OPEN:
                return $localize`:entry status created:Started`;
            case EntryStatus.FINALIZED:
                return $localize`:entry status completed:Done`;
            default:
                return 'empty';
        }
    }
}
