export function formatRepoDate(value, language) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat(language, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}

export function createRepoCard(repo, language) {
  const card = document.createElement('article');
  card.className = 'repo-card';

  const title = document.createElement('h3');
  const link = document.createElement('a');
  link.href = repo.html_url;
  link.textContent = repo.name.replace(/_/g, ' ');
  title.appendChild(link);

  const description = document.createElement('p');
  description.textContent = repo.description || 'Public repository';

  const meta = document.createElement('div');
  meta.className = 'repo-meta';

  const updated = document.createElement('span');
  updated.textContent = formatRepoDate(repo.updated_at, language);
  meta.appendChild(updated);

  if (repo.language) {
    const languageBadge = document.createElement('span');
    languageBadge.textContent = repo.language;
    meta.appendChild(languageBadge);
  }

  card.append(title, description, meta);
  return card;
}
