export interface FacilityLwDetails {
    nrOfWorkersBelowLivingWage: number;
    avgLivingWageGap: number;
    largestLivingWageGap: number;
    annualFacilityLivingWageGap: number;
}

export interface WorkerLwDetails {
    livingWageGap: number;
    annualLivingWageGap: number;
    annualLivingWageGapAllWorkers: number;
}
