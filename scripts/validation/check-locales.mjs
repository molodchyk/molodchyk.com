import { translations } from '../../pages/home/copy.js';
import {
  BASE_COPY as MOTIONBLOCK_BASE_COPY,
  LOCALE_ALIASES as MOTIONBLOCK_LOCALE_ALIASES,
  LOCALE_COPY as MOTIONBLOCK_LOCALE_COPY
} from '../../motionblock/uninstall/copy/index.js';
import { FORMSPREE_FIELD_NAMES as MOTIONBLOCK_FORMSPREE_FIELD_NAMES } from '../../motionblock/uninstall/form.js';
import {
  BASE_COPY as YMB_BASE_COPY,
  LOCALE_ALIASES as YMB_LOCALE_ALIASES,
  LOCALE_COPY as YMB_LOCALE_COPY
} from '../../youtube-mix-blocker/uninstall/copy/index.js';
import { FORMSPREE_FIELD_NAMES as YMB_FORMSPREE_FIELD_NAMES } from '../../youtube-mix-blocker/uninstall/form.js';
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

checkUninstallLocales({
  aliases: YMB_LOCALE_ALIASES,
  baseCopy: YMB_BASE_COPY,
  fieldNames: YMB_FORMSPREE_FIELD_NAMES,
  htmlPath: 'youtube-mix-blocker/uninstall/index.html',
  label: 'YouTube Mix Blocker',
  localeCopy: YMB_LOCALE_COPY
});

checkUninstallLocales({
  aliases: MOTIONBLOCK_LOCALE_ALIASES,
  baseCopy: MOTIONBLOCK_BASE_COPY,
  fieldNames: MOTIONBLOCK_FORMSPREE_FIELD_NAMES,
  htmlPath: 'motionblock/uninstall/index.html',
  label: 'MotionBlock',
  localeCopy: MOTIONBLOCK_LOCALE_COPY,
  forbiddenText: ['YouTube', 'Mix Blocker'],
  protectedTokens: ['MotionBlock', 'Formspree'],
  requiredHtmlText: ['https://formspree.io/f/mdaryvjp', 'MotionBlock uninstall feedback', 'reasonSiteCompatibility']
});

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('Checked homepage translations, uninstall translations, locale aliases, and Formspree field names.');

function checkUninstallLocales({
  aliases,
  baseCopy,
  fieldNames,
  forbiddenText = [],
  htmlPath,
  label,
  localeCopy,
  protectedTokens = [],
  requiredHtmlText = []
}) {
  for (const [locale, copy] of Object.entries(localeCopy)) {
    compareKeys(`${label} uninstall ${locale}`, baseCopy, copy);
  }

  const supportedUninstallLocales = new Set(['en', ...Object.keys(localeCopy)]);
  for (const locale of chromeWebStoreLocales) {
    if (!supportedUninstallLocales.has(locale) && !aliases[locale]) {
      errors.push(`${label} uninstall feedback missing Chrome Web Store locale ${locale}.`);
    }
  }

  for (const [alias, target] of Object.entries(aliases)) {
    if (target !== 'en' && !localeCopy[target]) {
      errors.push(`${label} locale alias ${alias} points to missing ${target}.`);
    }
  }

  const html = readText(htmlPath);
  const formNames = [...html.matchAll(/\bname=["']([^"']+)["']/g)].map(match => match[1]);
  for (const fieldName of requiredFormFields) {
    if (!formNames.includes(fieldName) || !fieldNames.includes(fieldName)) {
      errors.push(`${label} missing Formspree field name ${fieldName}.`);
    }
  }

  const allCopyText = JSON.stringify(localeCopy);
  const searchableText = `${html}\n${allCopyText}`;
  for (const text of forbiddenText) {
    if (searchableText.includes(text)) {
      errors.push(`${label} uninstall page must not include stale text: ${text}`);
    }
  }

  if (protectedTokens.length) {
    const tokenPattern = protectedTokens.map(escapeRegExp).join('|');
    const gluedTokenPattern = new RegExp(`[\\p{L}\\p{M}\\p{N}](?:${tokenPattern})|(?:${tokenPattern})[\\p{L}\\p{M}\\p{N}]`, 'u');
    if (gluedTokenPattern.test(searchableText)) {
      errors.push(`${label} uninstall copy has a protected token glued to translated text.`);
    }
  }

  for (const text of requiredHtmlText) {
    if (!html.includes(text)) {
      errors.push(`${label} uninstall page must include: ${text}`);
    }
  }
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
