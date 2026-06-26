import { BASE_COPY, LOCALE_COPY } from './copy/index.js';
import { getFeedbackMetadata, populateFeedbackFields } from './form.js';
import { getCanonicalLocale, RTL_LOCALES } from './params.js';
import { applyThemeMode, getSavedThemeMode, initializeThemeSwitcher } from '../../scripts/app/theme.js';

function setMetaContent(selector, content) {
  const element = document.querySelector(selector);
  if (element) {
    element.setAttribute('content', content);
  }
}

function applyTextCopy(copy) {
  for (const element of document.querySelectorAll('[data-i18n]')) {
    const key = element.dataset.i18n;
    element.textContent = copy[key] || BASE_COPY[key] || element.textContent;
  }

  for (const element of document.querySelectorAll('[data-i18n-aria-label]')) {
    const key = element.dataset.i18nAriaLabel;
    element.setAttribute('aria-label', copy[key] || BASE_COPY[key] || element.getAttribute('aria-label'));
  }
}

function updateYear() {
  const year = document.getElementById('year');
  if (year) {
    year.textContent = '2023 - ' + new Date().getFullYear();
  }
}

export function initializeUninstallPage() {
  applyThemeMode(getSavedThemeMode());
  initializeThemeSwitcher();

  const params = new URLSearchParams(window.location.search);
  const metadata = getFeedbackMetadata(params, navigator.language);
  const locale = getCanonicalLocale(metadata.language);
  const copy = {
    ...BASE_COPY,
    ...(LOCALE_COPY[locale] || {})
  };

  document.documentElement.lang = locale.replace('_', '-');
  document.documentElement.dir = RTL_LOCALES.has(locale) ? 'rtl' : 'ltr';
  document.documentElement.dataset.feedbackLocale = locale;
  document.title = copy.pageTitle;
  setMetaContent('meta[name="description"]', copy.metaDescription);
  setMetaContent('meta[property="og:title"]', copy.pageTitle);
  setMetaContent('meta[property="og:description"]', copy.metaDescription);
  applyTextCopy(copy);
  populateFeedbackFields(document, metadata);
  updateYear();
  document.documentElement.dataset.localizationState = 'ready';
}

initializeUninstallPage();
