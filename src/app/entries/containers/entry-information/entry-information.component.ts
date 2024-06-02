import { Component } from '@angular/core';
import { ICON } from '@shared/components/icon/icon.enum';
import { MODULE_ROUTE } from '@core/models';

@Component({
  selector: 'giz-entry-information',
  templateUrl: './entry-information.component.html',
  styleUrl: './entry-information.component.scss',
})
export class EntryInformationComponent {
  protected readonly icon = ICON;

    protected readonly moduleRoute = MODULE_ROUTE;
}
