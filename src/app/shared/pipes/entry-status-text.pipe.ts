import { Pipe, PipeTransform } from '@angular/core';
import { EntryStatus } from '@api/models';

@Pipe({ name: 'entryStatusText' })
export class EntryStatusTextPipe implements PipeTransform {
    public transform(status: EntryStatus): string {
        switch (status) {
            case EntryStatus.CREATED:
                return $localize`:entry status created:Entry created`;
            case EntryStatus.INFO_DONE:
                return $localize`:entry status info:Information done`;
            case EntryStatus.PAYROLL_DONE:
                return $localize`:entry status payroll:Payroll information done`;
            case EntryStatus.SCENARIO_DONE:
                return $localize`:entry status scenario:Scenario done`;
            case EntryStatus.DISTRIBUTION_DONE:
                return $localize`:entry status distribution:Distribution done`;
            case EntryStatus.COMPLETED:
                return $localize`:entry status completed:Done`;
            default:
                return 'empty';
        }
    }
}
