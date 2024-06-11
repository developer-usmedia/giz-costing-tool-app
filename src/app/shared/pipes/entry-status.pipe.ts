import { Pipe, PipeTransform } from '@angular/core';
import { EntryStatus } from '@api/models';

import { Status } from '@shared/components/status/status.type';

@Pipe({ name: 'entryStatus' })
export class EntryStatusPipe implements PipeTransform {
    public transform(status: EntryStatus): Status {
        switch (status) {
            case EntryStatus.OPEN:
                return 'started';
            case EntryStatus.FINALIZED:
                return 'done';
            default:
                return 'empty';
        }
    }
}
