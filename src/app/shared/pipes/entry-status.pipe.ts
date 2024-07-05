import { Pipe, PipeTransform } from '@angular/core';
import { EntryStatus } from '@api/models';

import { Status } from '@shared/components/status/status.type';

@Pipe({ name: 'entryStatus' })
export class EntryStatusPipe implements PipeTransform {
    public transform(status: EntryStatus): Status {
        switch (status) {
            case EntryStatus.INFO_DONE:
            case EntryStatus.PAYROLL_DONE:
                return 'started';
            case EntryStatus.SCENARIO_DONE:
            case EntryStatus.DISTRIBUTION_DONE:
                return 'ongoing';
            case EntryStatus.COMPLETED:
                return 'done';
            default:
                return 'empty';
        }
    }
}
