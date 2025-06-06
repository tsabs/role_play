import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import translationEn from './en-US/translations.json';
import translationFr from './fr-FR/translations.json';

const resources = {
    'fr-FR': { translation: translationFr },
    'en-US': { translation: translationEn },
};

const initI18n = async () => {
    const savedLanguage = Localization.getLocales()[0].languageCode;

    i18n.use(initReactI18next).init({
        resources,
        lng: savedLanguage,
        fallbackLng: 'fr-FR',
        interpolation: {
            escapeValue: false,
        },
    });
};

initI18n();

export default i18n;
