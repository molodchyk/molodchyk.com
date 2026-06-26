import fs from 'node:fs';
import path from 'node:path';
import { relative, walkFiles } from './lib.mjs';

const ignoredExtensions = new Set(['.png', '.webp', '.jpg', '.jpeg', '.gif', '.ico', '.pdf', '.zip']);
const budgets = [
  { test: file => file.endsWith('.html'), limit: 350, label: 'HTML page' },
  { test: file => file.endsWith('.css'), limit: 450, label: 'stylesheet' },
  { test: file => file.endsWith('.js') || file.endsWith('.mjs'), limit: 500, label: 'JavaScript module' },
  { test: file => file.endsWith('.md'), limit: 500, label: 'Markdown document' }
];
const errors = [];
const rows = [];

for (const file of walkFiles()) {
  const extension = path.extname(file).toLowerCase();
  if (ignoredExtensions.has(extension)) continue;

  const relativePath = relative(file);
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/).length - 1;
  const budget = budgets.find(candidate => candidate.test(relativePath));
  rows.push({ lines, path: relativePath });

  if (budget && lines > budget.limit) {
    errors.push(`${relativePath} has ${lines} lines; ${budget.label} budget is ${budget.limit}.`);
  }
}

rows.sort((a, b) => b.lines - a.lines).slice(0, 12).forEach(row => {
  console.log(`${String(row.lines).padStart(4, ' ')} ${row.path}`);
});

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}
