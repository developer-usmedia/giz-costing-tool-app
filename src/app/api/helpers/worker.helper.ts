import { Distribution, Entry, Worker } from '@api/models';

export const determineWageIncrease = (worker: Worker, entry: Entry): number => {
    if (worker.scenario.specification?.remunerationIncrease) {
        return worker.scenario.specification.remunerationIncrease;
    }

    return Math.max(
        entry?.scenario?.specification?.remunerationIncrease || 0,
        worker.livingWage?.livingWageGap || 0,
    );
};

export const getWorkerDistribution = (worker: Worker, entry: Entry): Distribution => {
    return {
        baseWagePerc: (worker.scenario.distribution?.baseWagePerc ?? entry?.scenario?.distribution?.baseWagePerc) ?? 0,
        bonusesPerc: (worker.scenario.distribution?.bonusesPerc ?? entry?.scenario?.distribution?.bonusesPerc) ?? 0,
        ikbPerc: (worker.scenario.distribution?.ikbPerc ?? entry?.scenario?.distribution?.ikbPerc) ?? 0,
        ikbHousingPerc: (worker.scenario.distribution?.ikbHousingPerc ?? entry?.scenario?.distribution?.ikbHousingPerc) ?? 0,
        ikbFoodPerc: (worker.scenario.distribution?.ikbFoodPerc ?? entry?.scenario?.distribution?.ikbFoodPerc) ?? 0,
        ikbTransportPerc: (worker.scenario.distribution?.ikbTransportPerc ?? entry?.scenario?.distribution?.ikbTransportPerc) ?? 0,
        ikbHealthcarePerc: (worker.scenario.distribution?.ikbHealthcarePerc ?? entry?.scenario?.distribution?.ikbHealthcarePerc) ?? 0,
        ikbChildcarePerc: (worker.scenario.distribution?.ikbChildcarePerc ?? entry?.scenario?.distribution?.ikbChildcarePerc) ?? 0,
        ikbChildEducationPerc: (worker.scenario.distribution?.ikbChildEducationPerc ?? entry?.scenario?.distribution?.ikbChildEducationPerc) ?? 0,
    };
};
