import vm from 'node:vm';
import { relative, readText, walkFiles } from './lib.mjs';

const htmlFiles = walkFiles().filter(file => file.endsWith('.html'));
const inlineScriptPattern = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi;
let checked = 0;

for (const file of htmlFiles) {
  const html = readText(relative(file));
  for (const match of html.matchAll(inlineScriptPattern)) {
    const code = match[1].trim();
    if (!code) continue;
    new vm.Script(code, { filename: `${relative(file)}:inline-script` });
    checked += 1;
  }
}

console.log(`Checked ${checked} inline script(s).`);
