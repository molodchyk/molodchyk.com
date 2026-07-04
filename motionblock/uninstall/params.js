import { LOCALE_ALIASES, LOCALE_COPY } from './copy/index.js?v=20260704-1';

export const RTL_LOCALES = new Set(['ar', 'fa', 'he', 'ur']);
export const ALLOWED_FEEDBACK_SOURCES = new Set(['chrome']);
export const EXTENSION_VERSION_PATTERN = /^\d{1,5}(?:\.\d{1,5}){0,3}$/;
export const LANGUAGE_TAG_PATTERN = /^[a-z]{2,3}(?:[-_][a-z0-9]{2,8}){0,2}$/i;

export function getCanonicalLocale(rawLocale, localeCopy = LOCALE_COPY, aliases = LOCALE_ALIASES) {
  const normalizedLocale = String(rawLocale || 'en').trim().replace(/-/g, '_');
  const lowerLocale = normalizedLocale.toLowerCase();
  const aliasKey = Object.keys(aliases).find(key => key.toLowerCase() === lowerLocale);

  if (aliasKey) return aliases[aliasKey];
  if (normalizedLocale === 'en' || localeCopy[normalizedLocale]) return normalizedLocale;

  const baseLanguage = lowerLocale.split('_')[0];
  const directBase = Object.keys(localeCopy).find(key => key.toLowerCase() === baseLanguage);
  if (directBase) return directBase;

  return 'en';
}

export function getSafeFeedbackSource(value) {
  const source = String(value || '').trim().toLowerCase();
  if (!source) return 'unknown';
  return ALLOWED_FEEDBACK_SOURCES.has(source) ? source : 'unknown';
}

export function getSafeExtensionVersion(value) {
  const version = String(value || '').trim();
  return EXTENSION_VERSION_PATTERN.test(version) ? version : '';
}

export function getSafeLanguageTag(value) {
  const language = String(value || 'en').trim().slice(0, 35);
  if (!LANGUAGE_TAG_PATTERN.test(language)) return 'en';

  const [baseLanguage, ...subtags] = language.replace(/_/g, '-').split('-');
  const normalizedSubtags = subtags.map(subtag => {
    if (/^[a-z]{4}$/i.test(subtag)) {
      return subtag.charAt(0).toUpperCase() + subtag.slice(1).toLowerCase();
    }

    if (/^[a-z]{2}$/i.test(subtag)) {
      return subtag.toUpperCase();
    }

    return subtag.toLowerCase();
  });

  return [baseLanguage.toLowerCase(), ...normalizedSubtags].join('-');
}
