import { Pipe, PipeTransform } from '@angular/core';

import { GIZ_ROUTES } from 'app/app-routing.module';

@Pipe({ name: 'route' })
export class RoutePipe implements PipeTransform {
    public transform(value: string): string {
        // TODO: Fix language setting and fetching in language switcher ticket
        const browserLang = navigator.language?.substring(0, 2) || 'en';

        if(browserLang === 'es') {
            return GIZ_ROUTES.es[value];
        }

        return GIZ_ROUTES.en[value];
    }
}
