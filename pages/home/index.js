import { applyThemeMode, getSavedThemeMode, initializeThemeSwitcher } from '../../scripts/app/theme.js';
import { createLanguageController } from '../../scripts/app/language.js';
import { loadGithubRepos } from '../../scripts/features/github-repos/index.js';
import { translations } from './copy.js';

function initializeYear() {
  const year = document.getElementById('year');
  if (year) {
    const startYear = 2023;
    const currentYear = new Date().getFullYear();
    year.textContent = currentYear > startYear ? startYear + ' - ' + currentYear : String(startYear);
  }
}

export function initializeHomePage() {
  const initialThemeMode = getSavedThemeMode();
  applyThemeMode(initialThemeMode);
  initializeThemeSwitcher();

  const languageController = createLanguageController(translations);
  const initialLanguage = languageController.getInitialLanguage();
  languageController.applyLanguage(initialLanguage);
  languageController.initializeLanguageSwitcher(language => loadGithubRepos(language));
  initializeYear();
  loadGithubRepos(initialLanguage);
}
