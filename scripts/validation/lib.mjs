import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = path.resolve(fileURLToPath(new URL('../..', import.meta.url)));

export function toPosixPath(filePath) {
  return filePath.split(path.sep).join('/');
}

export function readText(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

export function walkFiles(directory = root) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.name === '.git' || entry.name === 'node_modules') continue;

    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkFiles(fullPath));
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

export function relative(filePath) {
  return toPosixPath(path.relative(root, filePath));
}

export function stripQuery(value) {
  return value.split('?')[0].split('#')[0];
}

export function isLocalReference(value) {
  return value
    && !value.startsWith('http:')
    && !value.startsWith('https:')
    && !value.startsWith('mailto:')
    && !value.startsWith('#')
    && !value.startsWith('data:')
    && !value.startsWith('node:');
}

export function resolveLocalReference(fromFile, reference) {
  const cleanReference = stripQuery(reference);
  const base = cleanReference.startsWith('/')
    ? root
    : path.dirname(fromFile);
  const target = cleanReference.startsWith('/')
    ? cleanReference.slice(1)
    : cleanReference;

  return path.resolve(base, target);
}
