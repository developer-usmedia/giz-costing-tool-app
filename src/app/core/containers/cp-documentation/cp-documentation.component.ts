import { Component } from '@angular/core';

@Component({
    selector: 'giz-cp-documentation',
    templateUrl: './cp-documentation.component.html',
    styleUrl: './cp-documentation.component.scss',
})
export class CpDocumentationComponent {
    public markdown: string = this.getMarkdown();

    // eslint-disable-next-line max-lines-per-function
    public getMarkdown() {
        return $localize`:homepage body:
# Documentation

## About the Tool

On many farms or plantations, at least some workers do not earn a living wage. There is a gap between the actual wage paid and a living wage. If at least some workers on a farm or plantation do not receive a living wage, there are various ways to close the gap between the actual wage paid and a living wage: Strong trade unions and workers' representatives are an important lever to work towards improved wage and working conditions in the long term within the framework of collective agreements. Companies can also make a proactive contribution through their procurement practices and reward producers for high wage and labour standards. For example, through an additional price premium to cover the extra costs of paying living wages.

In order to advance the payment of living wages, GIZ developed the Living Wage Costing Tool. Based on the output of the IDH Salary Matrix the GIZ Living Wage Costing Tool provides various calculations to help you analyse the direct cost implications for producers to pay workers a living wage. It therefore allows the producer to determine additional costs of paying a living wage at farm level.

Before starting the Costing Tool you need to fill out the IDH Salary Matrix and/or download your results. The resulting excel file (xlsx.) can then be directly uploaded into the tool. To help you and your suppliers complete the Costing Tool we offer open trainings on the 5th, 6th and 12th of August from 8-9.30 CST ([join here](https://us02web.zoom.us/j/89124009617?pwd=2xbUa9oLW0R3KiruRebT1tkCajSTbS.1)) and will include a link to a video online Demo session soon.

For any questions you might have, you can contact the following email: nicola.nuecken@giz.de

## How does it work?

The Costing Tool offers options of taking into account the existing wage structures, i.e. differences in the remuneration of different activities on a plantation or farm and enabling specific action at a job category level. The cost implications and updated wage structure of the scenario specified by the user is clearly presented and can be compared to the status quo.

1. Download the idh SM Outputs as an a slsx. file.
2. Create a new entry and upload the SM file.
3. Choose a scenario and default wage increase, specify additional costs incurred and levies and taxes.
4. Customize wage increase and levies and taxes per job category for your needs
5. Choose how to distribute the wage increase across base wage, bonuses and in-kind benefits.
6. Optional: Enter buyer specifications to calculate the voluntary contribution for specific buyers.
7. Review your results and compare it to the status quo.
8. Download your results and engage in conversations with your buyer.
`;
    }
}
