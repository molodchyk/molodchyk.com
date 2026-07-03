import { translations } from '../../pages/home/copy.js';
import { BASE_COPY, LOCALE_ALIASES, LOCALE_COPY } from '../../youtube-mix-blocker/uninstall/copy/index.js';
import { FORMSPREE_FIELD_NAMES } from '../../youtube-mix-blocker/uninstall/form.js';
import { readText } from './lib.mjs';

const errors = [];
const requiredFormFields = [
  'source',
  'version',
  'language',
  'reason',
  'details',
  'requested_feature',
  'reply_address'
];
const chromeWebStoreLocales = [
  'am',
  'ar',
  'az',
  'bg',
  'bn',
  'ca',
  'cs',
  'da',
  'de',
  'el',
  'en',
  'en_AU',
  'en_GB',
  'en_US',
  'es',
  'es_419',
  'et',
  'eu',
  'fa',
  'fi',
  'fil',
  'fr',
  'gu',
  'he',
  'hi',
  'hr',
  'hu',
  'hy',
  'id',
  'it',
  'ja',
  'ka',
  'kn',
  'ko',
  'lt',
  'lv',
  'mk',
  'ml',
  'mr',
  'ms',
  'ne',
  'nl',
  'no',
  'pa',
  'pl',
  'pt_BR',
  'pt_PT',
  'ro',
  'ru',
  'si',
  'sk',
  'sl',
  'sq',
  'sr',
  'sv',
  'sw',
  'ta',
  'te',
  'th',
  'tr',
  'uk',
  'ur',
  'uz',
  'vi',
  'zh_CN',
  'zh_TW'
];

function compareKeys(label, reference, candidate) {
  const referenceKeys = Object.keys(reference).sort();
  const candidateKeys = Object.keys(candidate).sort();
  const missing = referenceKeys.filter(key => !candidateKeys.includes(key));
  const extra = candidateKeys.filter(key => !referenceKeys.includes(key));

  if (missing.length > 0 || extra.length > 0) {
    errors.push(`${label} key mismatch. Missing: ${missing.join(', ') || 'none'}. Extra: ${extra.join(', ') || 'none'}.`);
  }
}

for (const [locale, copy] of Object.entries(translations)) {
  compareKeys(`home ${locale}`, translations.en, copy);
}

for (const [locale, copy] of Object.entries(LOCALE_COPY)) {
  compareKeys(`uninstall ${locale}`, BASE_COPY, copy);
}

const supportedUninstallLocales = new Set(['en', ...Object.keys(LOCALE_COPY)]);
for (const locale of chromeWebStoreLocales) {
  if (!supportedUninstallLocales.has(locale) && !LOCALE_ALIASES[locale]) {
    errors.push(`Uninstall feedback missing Chrome Web Store locale ${locale}.`);
  }
}

for (const [alias, target] of Object.entries(LOCALE_ALIASES)) {
  if (target !== 'en' && !LOCALE_COPY[target]) {
    errors.push(`Locale alias ${alias} points to missing ${target}.`);
  }
}

const uninstallHtml = readText('youtube-mix-blocker/uninstall/index.html');
const formNames = [...uninstallHtml.matchAll(/\bname=["']([^"']+)["']/g)].map(match => match[1]);
for (const fieldName of requiredFormFields) {
  if (!formNames.includes(fieldName) || !FORMSPREE_FIELD_NAMES.includes(fieldName)) {
    errors.push(`Missing Formspree field name ${fieldName}.`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('Checked homepage translations, uninstall translations, locale aliases, and Formspree field names.');
