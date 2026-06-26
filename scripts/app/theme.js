import { readStorage, writeStorage } from '../platform/storage.js';
import { setPressedState } from '../platform/dom.js';

export const themeModes = ['system', 'bright', 'dark'];
export const themeStorageKey = 'siteThemeMode';

export function getSystemTheme() {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'bright';
}

export function getSavedThemeMode() {
  const saved = readStorage(themeStorageKey);
  return themeModes.includes(saved) ? saved : 'system';
}

export function updateThemeColor(resolvedTheme) {
  const meta = document.getElementById('theme-color-meta');
  if (meta) {
    meta.setAttribute('content', resolvedTheme === 'dark' ? '#101419' : '#f6f8fb');
  }
}

export function applyThemeMode(mode) {
  const selectedMode = themeModes.includes(mode) ? mode : 'system';
  const resolvedTheme = selectedMode === 'system' ? getSystemTheme() : selectedMode;

  document.documentElement.dataset.themeMode = selectedMode;
  document.documentElement.dataset.resolvedTheme = resolvedTheme;
  setPressedState('[data-theme-choice]', selectedMode, element => element.dataset.themeChoice);

  writeStorage(themeStorageKey, selectedMode);
  updateThemeColor(resolvedTheme);
}

export function initializeThemeSwitcher() {
  document.querySelectorAll('[data-theme-choice]').forEach(button => {
    button.addEventListener('click', () => {
      applyThemeMode(button.dataset.themeChoice);
    });
  });

  const systemTheme = window.matchMedia?.('(prefers-color-scheme: dark)');
  if (!systemTheme) {
    return;
  }

  const handleSystemThemeChange = () => {
    if (getSavedThemeMode() === 'system') {
      applyThemeMode('system');
    }
  };

  if (typeof systemTheme.addEventListener === 'function') {
    systemTheme.addEventListener('change', handleSystemThemeChange);
  } else if (typeof systemTheme.addListener === 'function') {
    systemTheme.addListener(handleSystemThemeChange);
  }
}
