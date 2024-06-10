import { ICON } from '@shared/components/icon/icon.enum';

export interface BreadcrumbItem {
    name: string;
    icon?: ICON;
    link?: string | any[];
    active?: boolean;
}
