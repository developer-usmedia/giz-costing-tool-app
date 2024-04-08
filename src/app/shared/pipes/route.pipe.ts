import { Pipe, PipeTransform } from '@angular/core';

import { RouteName } from '@core/models';
import { RouteService } from '@shared/services';

@Pipe({ name: 'route' })
export class RoutePipe implements PipeTransform {
    constructor(
        private readonly routeService: RouteService,
    ) {
    }
    public transform(routeName: RouteName): string {
        return this.routeService.getLink(routeName);
    }
}
