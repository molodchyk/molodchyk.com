import { getSafeExtensionVersion, getSafeFeedbackSource, getSafeLanguageTag } from './params.js';

export const FORMSPREE_FIELD_NAMES = [
  'source',
  'version',
  'language',
  'reason',
  'details',
  'requested_feature',
  'reply_address'
];

export function getFeedbackMetadata(params, navigatorLanguage = 'en') {
  return {
    source: getSafeFeedbackSource(params.get('source')),
    version: getSafeExtensionVersion(params.get('version')),
    language: getSafeLanguageTag(params.get('lang') || navigatorLanguage)
  };
}

export function populateFeedbackFields(documentRef, metadata) {
  documentRef.getElementById('feedback-source').value = metadata.source;
  documentRef.getElementById('feedback-version').value = metadata.version;
  documentRef.getElementById('feedback-language').value = metadata.language;
}
