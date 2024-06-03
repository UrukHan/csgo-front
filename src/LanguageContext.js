import React, { useState, useEffect, createContext } from 'react';
import i18n from './i18n';

export const LanguageContext = createContext({
    language: 'en',
    setLanguage: () => {},
});

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('en');
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        const savedLanguage = localStorage.getItem('language');
        if (savedLanguage) {
            i18n.changeLanguage(savedLanguage);
            setLanguage(savedLanguage);
            setInitialized(true);
        } else {
            fetch('https://ipapi.co/json')
                .then((response) => response.json())
                .then((data) => {
                    const countryCode = data.country;
                    const countryToLanguageMap = {
                        US: 'en', // United States
                        GB: 'en', // United Kingdom
                        AU: 'en', // Australia
                        NZ: 'en', // New Zealand
                        IE: 'en', // Ireland
                        ZA: 'en', // South Africa
                        PH: 'en', // Philippines
                        CA: 'en', // Canada
                        RU: 'ru', // Russia
                        BY: 'ru', // Belarus
                        KZ: 'ru', // Kazakhstan
                        KG: 'ru', // Kyrgyzstan
                        MD: 'ru', // Moldova
                        TJ: 'ru', // Tajikistan
                        CN: 'ch', // China
                        TW: 'ch', // Taiwan
                        SG: 'ch', // Singapore
                        HK: 'ch', // Hong Kong
                        MO: 'ch', // Macao
                        ES: 'es', // Spain
                        MX: 'es', // Mexico
                        CO: 'es', // Colombia
                        AR: 'es', // Argentina
                        PE: 'es', // Peru
                        VE: 'es', // Venezuela
                        CL: 'es', // Chile
                        EC: 'es', // Ecuador
                        GT: 'es', // Guatemala
                        CU: 'es', // Cuba
                        BO: 'es', // Bolivia
                        DO: 'es', // Dominican Republic
                        FR: 'fr', // France
                        MC: 'fr', // Monaco
                        CM: 'fr', // Cameroon
                        CI: 'fr', // Ivory Coast
                        SN: 'fr', // Senegal
                        MG: 'fr', // Madagascar
                        DE: 'ge', // Germany
                        AT: 'ge', // Austria
                        CH: 'ge', // Switzerland
                        LI: 'ge', // Liechtenstein
                        LU: 'ge', // Luxembourg
                        BE: 'ge', // Belgium
                        IN: 'in', // India
                        NP: 'in', // Nepal
                        BD: 'in', // Bangladesh
                        FJ: 'in', // Fiji
                        JP: 'jp', // Japan
                        AE: 'ar', // United Arab Emirates
                        SA: 'ar', // Saudi Arabia
                        EG: 'ar', // Egypt
                        IQ: 'ar', // Iraq
                        MA: 'ar', // Morocco
                        SY: 'ar', // Syria
                        YE: 'ar', // Yemen
                        TN: 'ar', // Tunisia
                        JO: 'ar', // Jordan
                        LY: 'ar', // Libya
                        SD: 'ar', // Sudan
                        DZ: 'ar', // Algeria
                        PT: 'pg', // Portugal
                        BR: 'pg', // Brazil
                        AO: 'pg', // Angola
                        MZ: 'pg', // Mozambique
                        GW: 'pg', // Guinea-Bissau
                        CV: 'pg', // Cape Verde
                        TL: 'pg', // East Timor
                        ST: 'pg', // Sao Tome and Principe
                        GQ: 'pg', // Equatorial Guinea
                        // Add other countries as needed...
                    };
                    const determinedLanguage = countryToLanguageMap[countryCode] || 'en';
                    i18n.changeLanguage(determinedLanguage);
                    setLanguage(determinedLanguage);
                    setInitialized(true);
                })
                .catch((error) => {
                    console.log('Error:', error);
                    i18n.changeLanguage('en');
                    setInitialized(true);
                });
        }
    }, []);

    useEffect(() => {
        if (initialized) {
            localStorage.setItem('language', language);
        }
    }, [language, initialized]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};