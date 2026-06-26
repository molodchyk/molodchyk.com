import { fallbackRepos } from './fallbackRepos.js';
import { fetchGithubRepos } from './githubApi.js';
import { createRepoCard } from './repoCard.js';

export function renderRepos(repos, language) {
  const grid = document.getElementById('repoGrid');
  if (!grid) {
    return;
  }

  grid.replaceChildren(...repos.slice(0, 6).map(repo => createRepoCard(repo, language)));
}

export async function loadGithubRepos(language, fetcher = fetchGithubRepos) {
  try {
    const repos = await fetcher();
    renderRepos(Array.isArray(repos) && repos.length > 0 ? repos : fallbackRepos, language);
  } catch {
    renderRepos(fallbackRepos, language);
  }
}
