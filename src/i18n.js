import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enTranslation from './locales/en.json';
import ruTranslation from './locales/ru.json';
import chTranslation from './locales/ch.json';
import esTranslation from './locales/es.json';
import frTranslation from './locales/fr.json';
import geTranslation from './locales/ge.json';
import inTranslation from './locales/in.json';
import jpTranslation from './locales/jp.json';
import arTranslation from './locales/ar.json';
import pgTranslation from './locales/pg.json';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: enTranslation
            },
            ru: {
                translation: ruTranslation
            },
            ch: {
                translation: chTranslation
            },
            es: {
                translation: esTranslation
            },
            fr: {
                translation: frTranslation
            },
            ge: {
                translation: geTranslation
            },
            in: {
                translation: inTranslation
            },
            jp: {
                translation: jpTranslation
            },
            ar: {
                translation: arTranslation
            },
            pg: {
                translation: pgTranslation
            }
        },
        lng: "en",
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;