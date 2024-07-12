import { Pipe, PipeTransform } from '@angular/core';

import { BuyerUnit } from '@api/models';

@Pipe({ name: 'buyerUnit' })
export class BuyerUnitPipe implements PipeTransform {
    public transform(unit?: string): string {
        switch (unit) {
            case BuyerUnit.UNIT:
                return $localize`:unit title:Unit`;
            case BuyerUnit.PERCENTAGE:
                return '%';
            default:
                return '';
        }
    }
}
