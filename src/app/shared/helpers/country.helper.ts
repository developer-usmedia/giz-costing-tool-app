export const getNameFromCountryCode = (countryCode: string, locale: string): string | undefined => {
    if (!countryCode) {
        return undefined;
    }
    const regionNames = new Intl.DisplayNames([locale], { type: 'region' });
    return regionNames.of(countryCode);
};
