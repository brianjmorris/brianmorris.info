// Render the current templates without deploying or calling the production function.
import { readFile, writeFile, mkdir, cp } from 'node:fs/promises';
import { createRequire } from 'node:module';
const require = createRequire(new URL('../functions/package.json', import.meta.url));
const ejs = require('ejs');
const aliases = require('../functions/aliases.js');

const html = await ejs.renderFile('functions/views/pages/home.ejs', {});
await mkdir('.preview', { recursive: true });
await cp('public', '.preview/public', { recursive: true });
await writeFile('.preview/public/index.html', html);
await writeFile('.preview/public/404.html', '<!doctype html><html lang="en"><meta charset="utf-8"><title>Page not found</title><h1>Page not found</h1><p><a href="/">Return to Brian Morris\'s homepage</a></p></html>');
const config = JSON.parse(await readFile('firebase.json', 'utf8'));
// A separate config prevents preview settings from changing production deployments.
const hosting = { ...config.hosting };
delete hosting.rewrites;
hosting.redirects = [...aliases].map(([source, destination]) => ({
  source, destination, type: 302,
}));
// Preserve the uppercase document links used by the contact section.
hosting.redirects.push(...['pdf', 'docx'].map(format => ({
  source: '/' + format.toUpperCase(), destination: '/brianmorris.' + format, type: 302,
})));
hosting.headers = [
  ...(hosting.headers || []),
  { source: '**', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
];
await writeFile('.preview/firebase.json', JSON.stringify({ hosting }, null, 2) + '\n');
