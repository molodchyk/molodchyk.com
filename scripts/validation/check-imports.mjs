import fs from 'node:fs';
import path from 'node:path';
import {
  isLocalReference,
  relative,
  resolveLocalReference,
  root,
  stripQuery,
  walkFiles
} from './lib.mjs';

const errors = [];
const files = walkFiles();

function assertExists(fromFile, reference) {
  if (!isLocalReference(reference)) return;

  const target = resolveLocalReference(fromFile, reference);
  if (!fs.existsSync(target)) {
    errors.push(`${relative(fromFile)} references missing ${stripQuery(reference)}`);
  }
}

for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  const extension = path.extname(file);

  if (extension === '.html') {
    for (const match of text.matchAll(/<script[^>]+\bsrc=["']([^"']+)["']/gi)) {
      assertExists(file, match[1]);
    }
    for (const match of text.matchAll(/<link[^>]+\bhref=["']([^"']+)["']/gi)) {
      assertExists(file, match[1]);
    }
  }

  if (extension === '.css') {
    for (const match of text.matchAll(/@import\s+(?:url\()?["']?([^"')]+)["']?\)?/gi)) {
      assertExists(file, match[1]);
    }
  }

  if (extension === '.js' || extension === '.mjs') {
    for (const match of text.matchAll(/\b(?:import|export)\s+(?:[^'"()]*?\s+from\s+)?["']([^"']+)["']/g)) {
      assertExists(file, match[1]);
    }
    for (const match of text.matchAll(/\bimport\(\s*["']([^"']+)["']\s*\)/g)) {
      assertExists(file, match[1]);
    }
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`Checked imports and local asset references under ${root}.`);
