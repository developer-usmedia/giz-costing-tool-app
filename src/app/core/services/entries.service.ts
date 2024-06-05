import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class EntriesService {

    // Test entry
    public getEntry(_id: string) {
        return {
            id: 'bd101a34-0438-4065-b84c-a4efc7258204',
            year: '2023',
            administrativeCosts: 200,
            defaultEmployerTax: 3,
            defaultEmployeeTax: 5,
            status: 'submitted',
            createdAt: '2023-11-05',
            updatedAt: '2023-29-05',
            facility: {
                id: 'BRMASO-0002',
                name: 'Facility Name',
                countryCode: 'BR',
                currencyCode: 'BRL',
                product: 'Bananas',
                unitOfProduction: 'Box',
                annualProduction: 200000,
                buyerName: 'Lidl',
                buyerProportion: 50,
            },
            benchmark: {
                year: '2023',
                source: 'source',
                region: 'São Paulo',
                locality: 'Rural',
                localValue: 462,
                currencyCode:'BRL',
                currencyName: 'Brazilian Real',
            },
            _links: {
                self: {
                    href: '/',
                },
            },
        };
    }
}
