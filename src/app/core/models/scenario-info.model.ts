import { ScenarioType } from '@api/models/scenario.model';

export interface ScenarioInfo {
    type: ScenarioType;
    imageUrl: string;
    title: string;
    description: string;
    overviewIntro?: string;
    comments: string;
}

export const SCENARIOS: ScenarioInfo[] = [
    {
        type: ScenarioType.CLOSE_GAP,
        imageUrl: 'assets/images/scenario-close-gap.png',
        title: $localize`:scenario close-gap title: Close the living wage gap`,
        description: $localize`:scenario close-gap description:Closing the living wage gap by increasing wage levels of all workers below living wage to living wage`,
        comments: $localize`:scenario close-gap comment-1:
Analyse the cost implications of closing the living wage gap by increasing wage levels of all workers below living wage to living wage.

This scenario closes the entire living wage gap of all workers below living wage. Wage levels of workers above living wage remain unchanged.

While this scenario leaves no one behind and closes the entire gap, it distorts the wage structure of the farm and might have potential unforeseen negative social consequences. We very strongly advise to consider possible negative consequences of distorting the wage structure and  of increasing wages differently between groups such as unrest, increased animosity and social division.

This scenario allows no modification of wage increases.`,
    },
    {
        type: ScenarioType.ABSOLUTE_INCREASE,
        imageUrl: 'assets/images/scenario-absolute-wage.png',
        title: $localize`:scenario absolute-increase title: Absolute wage increase`,
        description: $localize`:scenario absolute-increase description:Closing the living wage gap by increasing wage levels of all workers per job category.`,
        comments: $localize`:scenario absolute-increase comment-1:
Analyse the cost implications of closing the living wage gap by increasing wage levels of all workers per job category. This allows you to take into account the existing wage structures, i.e. differences in the remuneration of different activities on a plantation or farm.

You can choose to close the entire wage gap i.e. no worker is below living wage and additionanly increase wages of workers above living wage to consider the already existing wage structure.

You can also choose to increase all wages per job category by different amounts, enabeling targetet actions for the lowest paid workers and gender specific actions. Depending on the specifications by the user this scenario might leave some workers earning less than a living wage.`,
        overviewIntro: $localize`:scenario overview-intro:Below an overview per job-category. If you want, you can overrule the default increase per job-category.`,
    },
];
