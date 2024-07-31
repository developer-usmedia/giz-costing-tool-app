import { Component } from '@angular/core';
import { AUTH_ROUTE, MODULE_ROUTE, ROOT_ROUTE } from '@core/models';
import { AuthService } from '@core/services';

@Component({
    selector: 'giz-homepage',
    templateUrl: './homepage.component.html',
    styleUrl: './homepage.component.scss',
})
export class HomepageComponent {
    public loggedIn = this.authService.isLoggedIn();

    protected readonly moduleRoute = MODULE_ROUTE;
    protected readonly authRoute = AUTH_ROUTE;
    protected readonly rootRoute = ROOT_ROUTE;

    constructor(
        private readonly authService: AuthService,
    ) {
    }

    public getMarkdown() {
        return $localize`:homepage body:
On many farms or plantations, at least some workers do not earn a living wage. There is a gap between the actual wage paid and a living wage. If at least some workers on a farm or plantation do not receive a living wage, there are various ways to close the gap between the actual wage paid and a living wage: Strong trade unions and workers' representatives are an important lever to work towards improved wage and working conditions in the long term within the framework of collective agreements. Companies can also make a proactive contribution through their procurement practices and reward producers for high wage and labour standards. For example, through an additional price premium to cover the extra costs of paying living wages.

In order to advance the payment of living wages, GIZ developed the Living Wage Costing Tool. Based on the output of the IDH Salary Matrix the GIZ Living Wage Costing Tool provides various calculations to help you analyse the direct cost implications for producers to pay workers a living wage. It therefore allows the producer to determine additional costs of paying a living wage at farm level.
`;
    }
}
