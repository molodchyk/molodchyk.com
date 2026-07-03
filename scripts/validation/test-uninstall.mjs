import assert from 'node:assert/strict';
import { LOCALE_COPY } from '../../youtube-mix-blocker/uninstall/copy/index.js';
import { getFeedbackMetadata } from '../../youtube-mix-blocker/uninstall/form.js';
import {
  getCanonicalLocale,
  getSafeExtensionVersion,
  getSafeFeedbackSource,
  getSafeLanguageTag,
  RTL_LOCALES
} from '../../youtube-mix-blocker/uninstall/params.js';

assert.equal(getSafeFeedbackSource('chrome'), 'chrome');
assert.equal(getSafeFeedbackSource('firefox'), 'firefox');
assert.equal(getSafeFeedbackSource('<script>'), 'unknown');
assert.equal(getSafeFeedbackSource(''), 'unknown');

assert.equal(getSafeExtensionVersion('1.5.4'), '1.5.4');
assert.equal(getSafeExtensionVersion('2026.06.26.1'), '2026.06.26.1');
assert.equal(getSafeExtensionVersion('1.5.4<script>'), '');

assert.equal(getSafeLanguageTag('en-US'), 'en-US');
assert.equal(getSafeLanguageTag('pt_BR'), 'pt-BR');
assert.equal(getSafeLanguageTag('zh-hant-tw'), 'zh-Hant-TW');
assert.equal(getSafeLanguageTag('javascript:alert(1)'), 'en');

assert.equal(getCanonicalLocale('en-US'), 'en');
assert.equal(getCanonicalLocale('pt-BR'), 'pt_BR');
assert.equal(getCanonicalLocale('zh-Hant-TW'), 'zh_TW');
assert.equal(getCanonicalLocale('az'), 'az');
assert.equal(getCanonicalLocale('he'), 'he');
assert.equal(getCanonicalLocale('fa'), 'fa');
assert.equal(getCanonicalLocale('ur'), 'ur');
assert.equal(getCanonicalLocale('unknown'), 'en');

for (const locale of RTL_LOCALES) {
  assert.ok(LOCALE_COPY[locale], `Missing uninstall feedback copy for RTL locale: ${locale}`);
}

assert.match(LOCALE_COPY.he.headline, /[\u0590-\u05ff]/u);

assert.equal(RTL_LOCALES.has('ar'), true);
assert.equal(RTL_LOCALES.has('fa'), true);
assert.equal(RTL_LOCALES.has('he'), true);
assert.equal(RTL_LOCALES.has('ur'), true);
assert.equal(RTL_LOCALES.has('en'), false);

function createMemoryStorage() {
  const values = new Map();

  return {
    getItem(key) {
      return values.has(key) ? values.get(key) : null;
    },
    setItem(key, value) {
      values.set(key, String(value));
    }
  };
}

const validMetadata = getFeedbackMetadata(new URLSearchParams('source=chrome&version=1.5.4&lang=en-US'), 'de-DE');
assert.deepEqual(validMetadata, {
  source: 'chrome',
  version: '1.5.4',
  language: 'en-US'
});

const hostileMetadata = getFeedbackMetadata(new URLSearchParams('source=<script>&version=1.5.4<script>&lang=javascript:alert(1)'), 'de-DE');
assert.deepEqual(hostileMetadata, {
  source: 'unknown',
  version: '',
  language: 'en'
});

const sessionStorage = createMemoryStorage();
const initialFirefoxMetadata = getFeedbackMetadata(
  new URLSearchParams('source=firefox&version=1.5.2&lang=uk'),
  'de-DE',
  sessionStorage
);
assert.deepEqual(initialFirefoxMetadata, {
  source: 'firefox',
  version: '1.5.2',
  language: 'uk'
});

const reloadedFirefoxMetadata = getFeedbackMetadata(
  new URLSearchParams(''),
  'de-DE',
  sessionStorage
);
assert.deepEqual(reloadedFirefoxMetadata, initialFirefoxMetadata);

const freshMissingMetadata = getFeedbackMetadata(
  new URLSearchParams(''),
  'de-DE',
  createMemoryStorage()
);
assert.deepEqual(freshMissingMetadata, {
  source: 'unknown',
  version: '',
  language: 'de-DE'
});

console.log('Uninstall localization and parameter tests passed.');
