import { Entry, Worker } from '@api/models';

export const determineWageIncrease = (worker: Worker, entry: Entry) => {
    if (worker.scenario.specification?.remunerationIncrease) {
        return worker.scenario.specification.remunerationIncrease;
    }

    return Math.max(
        entry?.scenario?.specification?.remunerationIncrease || 0,
        worker.livingWage?.livingWageGap || 0,
    );
};