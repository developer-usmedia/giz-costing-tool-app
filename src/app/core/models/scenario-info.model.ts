import { ScenarioType } from '@api/models/scenario.model';

export interface ScenarioInfo {
    type: ScenarioType;
    imageUrl: string;
    title: string;
    description: string;
    overviewIntro?: string;
    comment1: string;
    comment2?: string;
}

export const SCENARIOS: ScenarioInfo[] = [
    {
        type: ScenarioType.CLOSE_GAP,
        imageUrl: 'assets/images/scenario-close-gap.png',
        title: $localize`:scenario close-gap title: Close the living wage gap`,
        description: $localize`:scenario close-gap description:Closing the living wage gap by increasing wage levels of all workers below living wage to living wage`,
        comment1: $localize`:scenario close-gap comment-1:Sed condimentum purus lectus, dignissim euismod arcu sagittis sed. Nulla dictum magna at nunc hendrerit, quis placerat nulla vulputate. Donec sodales at mauris nec sodales.`,
        comment2: $localize`:scenario close-gap comment-2:Maecenas scelerisque nisl id augue egestas, non pharetra nibh vehicula. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Duis nec lorem quam.`,
    },
    {
        type: ScenarioType.ABSOLUTE_INCREASE,
        imageUrl: 'assets/images/scenario-absolute-wage.png',
        title: $localize`:scenario absolute-increase title: Absolute wage increase`,
        description: $localize`:scenario absolute-increase description:Closing the living wage gap by an absolute wage increase for all workers.`,
        comment1: $localize`:scenario absolute-increase comment-1:Sed condimentum purus lectus, dignissim euismod arcu sagittis sed. Nulla dictum magna at nunc hendrerit, quis placerat nulla vulputate. Donec sodales at mauris nec sodales.`,
        comment2: $localize`:scenario absolute-increase comment-2:Maecenas scelerisque nisl id augue egestas, non pharetra nibh vehicula. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Duis nec lorem quam.`,
        overviewIntro: $localize`:scenario overview-intro:Below an overview per job-category. If you want, you can overrule the default increase per job-category.`,
    },
];
