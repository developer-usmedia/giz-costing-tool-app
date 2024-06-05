import { Pipe, PipeTransform } from '@angular/core';
import { Status } from '@shared/components/status/status.type';

@Pipe({ name: 'status' })
export class StatusPipe implements PipeTransform {
    public transform(_value: string): Status {
        // TODO: Get status from entry
        return 'started';
    }
}
