import assert from 'node:assert/strict';
import { LOCALE_COPY as MOTIONBLOCK_LOCALE_COPY } from '../../motionblock/uninstall/copy/index.js';
import { getFeedbackMetadata as getMotionBlockFeedbackMetadata } from '../../motionblock/uninstall/form.js';
import {
  getCanonicalLocale as getMotionBlockCanonicalLocale,
  getSafeFeedbackSource as getMotionBlockSafeFeedbackSource,
  RTL_LOCALES as MOTIONBLOCK_RTL_LOCALES
} from '../../motionblock/uninstall/params.js';
import { LOCALE_COPY as YMB_LOCALE_COPY } from '../../youtube-mix-blocker/uninstall/copy/index.js';
import { getFeedbackMetadata as getYmbFeedbackMetadata } from '../../youtube-mix-blocker/uninstall/form.js';
import {
  getCanonicalLocale as getYmbCanonicalLocale,
  getSafeExtensionVersion,
  getSafeFeedbackSource as getYmbSafeFeedbackSource,
  getSafeLanguageTag,
  RTL_LOCALES as YMB_RTL_LOCALES
} from '../../youtube-mix-blocker/uninstall/params.js';

assert.equal(getYmbSafeFeedbackSource('chrome'), 'chrome');
assert.equal(getYmbSafeFeedbackSource('firefox'), 'firefox');
assert.equal(getYmbSafeFeedbackSource('<script>'), 'unknown');
assert.equal(getYmbSafeFeedbackSource(''), 'unknown');
assert.equal(getMotionBlockSafeFeedbackSource('chrome'), 'chrome');
assert.equal(getMotionBlockSafeFeedbackSource('firefox'), 'unknown');
assert.equal(getMotionBlockSafeFeedbackSource('<script>'), 'unknown');

assert.equal(getSafeExtensionVersion('1.5.4'), '1.5.4');
assert.equal(getSafeExtensionVersion('2026.06.26.1'), '2026.06.26.1');
assert.equal(getSafeExtensionVersion('1.5.4<script>'), '');

assert.equal(getSafeLanguageTag('en-US'), 'en-US');
assert.equal(getSafeLanguageTag('pt_BR'), 'pt-BR');
assert.equal(getSafeLanguageTag('zh-hant-tw'), 'zh-Hant-TW');
assert.equal(getSafeLanguageTag('javascript:alert(1)'), 'en');

for (const getCanonicalLocale of [getYmbCanonicalLocale, getMotionBlockCanonicalLocale]) {
  assert.equal(getCanonicalLocale('en-US'), 'en');
  assert.equal(getCanonicalLocale('pt-BR'), 'pt_BR');
  assert.equal(getCanonicalLocale('zh-Hant-TW'), 'zh_TW');
  assert.equal(getCanonicalLocale('az'), 'az');
  assert.equal(getCanonicalLocale('he'), 'he');
  assert.equal(getCanonicalLocale('fa'), 'fa');
  assert.equal(getCanonicalLocale('ur'), 'ur');
  assert.equal(getCanonicalLocale('unknown'), 'en');
}

for (const locale of YMB_RTL_LOCALES) {
  assert.ok(YMB_LOCALE_COPY[locale], `Missing YouTube Mix Blocker uninstall feedback copy for RTL locale: ${locale}`);
}

for (const locale of MOTIONBLOCK_RTL_LOCALES) {
  assert.ok(MOTIONBLOCK_LOCALE_COPY[locale], `Missing MotionBlock uninstall feedback copy for RTL locale: ${locale}`);
}

assert.match(YMB_LOCALE_COPY.he.headline, /[\u0590-\u05ff]/u);
assert.match(MOTIONBLOCK_LOCALE_COPY.he.headline, /[\u0590-\u05ff]/u);

for (const rtlLocales of [YMB_RTL_LOCALES, MOTIONBLOCK_RTL_LOCALES]) {
  assert.equal(rtlLocales.has('ar'), true);
  assert.equal(rtlLocales.has('fa'), true);
  assert.equal(rtlLocales.has('he'), true);
  assert.equal(rtlLocales.has('ur'), true);
  assert.equal(rtlLocales.has('en'), false);
}

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

const validMetadata = getYmbFeedbackMetadata(new URLSearchParams('source=chrome&version=1.5.4&lang=en-US'), 'de-DE');
assert.deepEqual(validMetadata, {
  source: 'chrome',
  version: '1.5.4',
  language: 'en-US'
});

const hostileMetadata = getYmbFeedbackMetadata(new URLSearchParams('source=<script>&version=1.5.4<script>&lang=javascript:alert(1)'), 'de-DE');
assert.deepEqual(hostileMetadata, {
  source: 'unknown',
  version: '',
  language: 'en'
});

const sessionStorage = createMemoryStorage();
const initialFirefoxMetadata = getYmbFeedbackMetadata(
  new URLSearchParams('source=firefox&version=1.5.2&lang=uk'),
  'de-DE',
  sessionStorage
);
assert.deepEqual(initialFirefoxMetadata, {
  source: 'firefox',
  version: '1.5.2',
  language: 'uk'
});

const reloadedFirefoxMetadata = getYmbFeedbackMetadata(
  new URLSearchParams(''),
  'de-DE',
  sessionStorage
);
assert.deepEqual(reloadedFirefoxMetadata, initialFirefoxMetadata);

const freshMissingMetadata = getYmbFeedbackMetadata(
  new URLSearchParams(''),
  'de-DE',
  createMemoryStorage()
);
assert.deepEqual(freshMissingMetadata, {
  source: 'unknown',
  version: '',
  language: 'de-DE'
});

const motionBlockMetadata = getMotionBlockFeedbackMetadata(
  new URLSearchParams('source=chrome&version=1.0.1&lang=pt_BR'),
  'de-DE',
  createMemoryStorage()
);
assert.deepEqual(motionBlockMetadata, {
  source: 'chrome',
  version: '1.0.1',
  language: 'pt-BR'
});

const motionBlockFirefoxMetadata = getMotionBlockFeedbackMetadata(
  new URLSearchParams('source=firefox&version=1.0.1&lang=en'),
  'de-DE',
  createMemoryStorage()
);
assert.deepEqual(motionBlockFirefoxMetadata, {
  source: 'unknown',
  version: '1.0.1',
  language: 'en'
});

const motionBlockCopyText = JSON.stringify(MOTIONBLOCK_LOCALE_COPY);
assert.equal(motionBlockCopyText.includes('YouTube'), false);
assert.equal(motionBlockCopyText.includes('Mix Blocker'), false);

console.log('Uninstall localization and parameter tests passed.');
