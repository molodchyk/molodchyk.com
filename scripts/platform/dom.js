export function setPressedState(selector, activeValue, getValue) {
  document.querySelectorAll(selector).forEach(element => {
    element.setAttribute('aria-pressed', String(getValue(element) === activeValue));
  });
}

export function setLocalizedText(translations, fallbackTranslations = {}) {
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.dataset.i18n;
    const value = translations[key] || fallbackTranslations[key];
    if (value) {
      element.textContent = value;
    }
  });
}
