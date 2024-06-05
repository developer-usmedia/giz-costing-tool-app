import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';
import { getNameFromCountryCode } from '@shared/helpers';

@Pipe({ name: 'countryName', pure: false })
export class CountryNamePipe implements PipeTransform {
    constructor(
        @Inject(LOCALE_ID) public currentLocale: string,
    ) {
    }
    public transform(value: string): string | undefined {
        return getNameFromCountryCode(value, this.currentLocale);
    }
}
