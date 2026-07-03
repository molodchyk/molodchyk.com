import { getSafeExtensionVersion, getSafeFeedbackSource, getSafeLanguageTag } from './params.js?v=20260703-1';

const FEEDBACK_METADATA_SESSION_KEY = 'ymb.uninstall.feedbackMetadata';

export const FORMSPREE_FIELD_NAMES = [
  'source',
  'version',
  'language',
  'reason',
  'details',
  'requested_feature',
  'reply_address'
];

function getDefaultSessionStorage() {
  try {
    return globalThis.sessionStorage || null;
  } catch (_error) {
    return null;
  }
}

function hasQueryMetadata(params) {
  return ['source', 'version', 'lang'].some(name => String(params.get(name) || '').trim() !== '');
}

function readStoredFeedbackMetadata(storage) {
  if (!storage) return null;

  try {
    const rawValue = storage.getItem(FEEDBACK_METADATA_SESSION_KEY);
    if (!rawValue) return null;

    const parsed = JSON.parse(rawValue);

    return {
      source: getSafeFeedbackSource(parsed.source),
      version: getSafeExtensionVersion(parsed.version),
      language: getSafeLanguageTag(parsed.language)
    };
  } catch (_error) {
    return null;
  }
}

function writeStoredFeedbackMetadata(storage, metadata) {
  if (!storage) return;

  try {
    storage.setItem(FEEDBACK_METADATA_SESSION_KEY, JSON.stringify(metadata));
  } catch (_error) {
    // Feedback still works without session storage.
  }
}

export function getFeedbackMetadata(params, navigatorLanguage = 'en', storage = getDefaultSessionStorage()) {
  const queryMetadata = {
    source: getSafeFeedbackSource(params.get('source')),
    version: getSafeExtensionVersion(params.get('version')),
    language: getSafeLanguageTag(params.get('lang') || navigatorLanguage)
  };

  if (hasQueryMetadata(params)) {
    writeStoredFeedbackMetadata(storage, queryMetadata);
    return queryMetadata;
  }

  const storedMetadata = readStoredFeedbackMetadata(storage);
  if (storedMetadata) return storedMetadata;

  return {
    ...queryMetadata,
    source: 'unknown'
  };
}

export function populateFeedbackFields(documentRef, metadata) {
  documentRef.getElementById('feedback-source').value = metadata.source;
  documentRef.getElementById('feedback-version').value = metadata.version;
  documentRef.getElementById('feedback-language').value = metadata.language;
}
