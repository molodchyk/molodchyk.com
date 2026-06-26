import assert from 'node:assert/strict';
import { getFeedbackMetadata } from '../../youtube-mix-blocker/uninstall/form.js';
import {
  getCanonicalLocale,
  getSafeExtensionVersion,
  getSafeFeedbackSource,
  getSafeLanguageTag
} from '../../youtube-mix-blocker/uninstall/params.js';

assert.equal(getSafeFeedbackSource('chrome'), 'chrome');
assert.equal(getSafeFeedbackSource('firefox'), 'firefox');
assert.equal(getSafeFeedbackSource('<script>'), 'unknown');
assert.equal(getSafeFeedbackSource(''), 'chrome');

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
assert.equal(getCanonicalLocale('unknown'), 'en');

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

console.log('Uninstall parameter tests passed.');
