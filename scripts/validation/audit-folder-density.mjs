import fs from 'node:fs';
import path from 'node:path';
import { relative, root } from './lib.mjs';

const thresholds = [
  { test: directory => directory === '.', limit: 15, label: 'repository root' },
  { test: directory => directory === 'docs', limit: 12, label: 'docs folder' },
  { test: directory => directory === 'assets', limit: 20, label: 'assets folder' },
  { test: directory => directory.endsWith('/copy'), limit: 12, label: 'copy folder' },
  { test: directory => directory.includes('/uninstall'), limit: 12, label: 'page folder' },
  { test: directory => directory.includes('/features/'), limit: 15, label: 'feature folder' },
  { test: directory => directory.includes('/platform'), limit: 12, label: 'platform folder' }
];
const errors = [];
const rows = [];

function walk(directory) {
  if (path.basename(directory) === '.git' || path.basename(directory) === 'node_modules') return;

  const entries = fs.readdirSync(directory, { withFileTypes: true });
  const fileCount = entries.filter(entry => entry.isFile()).length;
  const relativeDirectory = relative(directory) || '.';
  rows.push({ files: fileCount, path: relativeDirectory });

  const threshold = thresholds.find(candidate => candidate.test(relativeDirectory));
  if (threshold && fileCount > threshold.limit) {
    errors.push(`${relativeDirectory} has ${fileCount} files; ${threshold.label} budget is ${threshold.limit}.`);
  }

  for (const entry of entries) {
    if (entry.isDirectory()) {
      walk(path.join(directory, entry.name));
    }
  }
}

walk(root);
rows.sort((a, b) => b.files - a.files).slice(0, 12).forEach(row => {
  console.log(`${String(row.files).padStart(3, ' ')} ${row.path}`);
});

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}
