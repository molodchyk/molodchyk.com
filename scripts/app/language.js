import { readStorage, writeStorage } from '../platform/storage.js';
import { setLocalizedText, setPressedState } from '../platform/dom.js';

export const languageStorageKey = 'siteLanguage';
export const languageSourceStorageKey = 'siteLanguageSource';

export function createLanguageController(translations) {
  const supportedLanguages = Object.keys(translations);

  function normalizeLanguage(value) {
    if (!value || typeof value !== 'string') {
      return null;
    }

    const language = value.toLowerCase();
    if (supportedLanguages.includes(language)) {
      return language;
    }

    const baseLanguage = language.split('-')[0];
    return supportedLanguages.includes(baseLanguage) ? baseLanguage : null;
  }

  function getSystemLanguage() {
    const languages = Array.isArray(navigator.languages) && navigator.languages.length > 0
      ? navigator.languages
      : [navigator.language];

    for (const language of languages) {
      const supportedLanguage = normalizeLanguage(language);
      if (supportedLanguage) {
        return supportedLanguage;
      }
    }

    return 'en';
  }

  function getSavedLanguage() {
    const saved = normalizeLanguage(readStorage(languageStorageKey));
    const source = readStorage(languageSourceStorageKey);
    return saved && source === 'manual' ? saved : null;
  }

  function getInitialLanguage() {
    return getSavedLanguage() || getSystemLanguage();
  }

  function applyLanguage(language, options = {}) {
    const selectedLanguage = normalizeLanguage(language) || getSystemLanguage();
    const dictionary = translations[selectedLanguage] || translations.en;
    document.documentElement.lang = selectedLanguage;
    setLocalizedText(dictionary, translations.en);
    setPressedState('[data-language]', selectedLanguage, element => element.dataset.language);

    if (options.persist) {
      writeStorage(languageStorageKey, selectedLanguage);
      writeStorage(languageSourceStorageKey, 'manual');
    }

    return selectedLanguage;
  }

  function initializeLanguageSwitcher(onLanguageChange) {
    document.querySelectorAll('[data-language]').forEach(button => {
      button.addEventListener('click', () => {
        const selectedLanguage = applyLanguage(button.dataset.language, { persist: true });
        onLanguageChange?.(selectedLanguage);
      });
    });
  }

  return {
    applyLanguage,
    getInitialLanguage,
    initializeLanguageSwitcher,
    normalizeLanguage
  };
}
