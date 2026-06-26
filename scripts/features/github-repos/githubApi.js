import { fetchJson } from '../../platform/fetchJson.js';

const GITHUB_REPOS_URL = 'https://api.github.com/users/molodchyk/repos?sort=updated&per_page=6';

export function fetchGithubRepos() {
  return fetchJson(GITHUB_REPOS_URL, {
    headers: { Accept: 'application/vnd.github+json' }
  });
}
