export const getNameFromCountryCode = (countryCode: string, locale: string): string | undefined => {
    if (!countryCode) {
        return undefined;
    }

    if (countryCode.length !== 2) {
        return countryCode;
    }

    const regionNames = new Intl.DisplayNames([locale], { type: 'region' });
    return regionNames.of(countryCode);
};
