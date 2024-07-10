export interface Distribution {
    baseWagePerc: number;
    bonusesPerc: number;
    ikbPerc: number;
    ikbHousingPerc: number;
    ikbFoodPerc: number;
    ikbTransportPerc: number;
    ikbHealthcarePerc: number;
    ikbChildcarePerc: number;
    ikbChildEducationPerc: number;
}

export interface DistributionForm {
    bonusesPerc: number | null;
    ikbHousingPerc: number | null;
    ikbFoodPerc: number | null;
    ikbTransportPerc: number | null;
    ikbHealthcarePerc: number | null;
    ikbChildcarePerc: number | null;
    ikbChildEducationPerc: number | null;
}
