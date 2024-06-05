import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'verified', pure: false })
export class VerifiedPipe implements PipeTransform {
    public transform(value: boolean): string | undefined {
        return value ? $localize`:entry verified:Verified` : $localize`:entry verified:Not verified`;
    }
}
