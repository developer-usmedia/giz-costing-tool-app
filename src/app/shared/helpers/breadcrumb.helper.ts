import { MODULE_ROUTE, ROOT_ROUTE, RouteName } from '@core/models';

export const getBreadCrumbTitle = (route: RouteName): string => {
    switch (route) {
        case ROOT_ROUTE.DASHBOARD:
            return $localize`:breadcrumb dashboard title:Dashboard`;
        case ROOT_ROUTE.EXAMPLES:
            return $localize`:breadcrumb examples title:Examples`;
        case ROOT_ROUTE.ACCOUNT:
            return $localize`:breadcrumb account title:Account`;
        case MODULE_ROUTE.ENTRIES:
            return $localize`:breadcrumb entries title:Entries`;
        default:
            return '';
    }
};
