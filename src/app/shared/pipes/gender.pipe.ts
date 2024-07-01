import { Pipe, PipeTransform } from '@angular/core';
import { Gender } from '@api/models';

@Pipe({ name: 'gender' })
export class GenderPipe implements PipeTransform {
    public transform(gender: Gender): string {
        switch (gender) {
            case Gender.MEN:
                return $localize`:gender men: Men`;
            case Gender.WOMEN:
                return $localize`:gender women: Women`;
            default:
                return 'empty';
        }
    }
}
