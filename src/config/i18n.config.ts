import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import des fichiers de traduction
import fr from '../locales/fr.json';
import en from '../locales/en.json';
import ar from '../locales/ar.json';

const resources = {
  fr: {
    translation: fr,
  },
  en: {
    translation: en,
  },
  ar: {
    translation: ar,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem('language') || 'fr',
  fallbackLng: 'fr',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;