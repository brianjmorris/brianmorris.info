/* © Brian Morris 2026 | https://brianmorris.info */

const { onRequest } = require('firebase-functions/v2/https');
const express = require('express');
const path = require('node:path');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views', 'pages'));

// Aliases match complete paths, never arbitrary substrings in unrelated URLs.
const aliases = new Map();
const addAliases = (paths, destination) => {
  for (const alias of paths) aliases.set('/' + alias, destination);
};

const wordAliases = [
  'doc', 'docx', 'docs', 'document', 'documents', 'word', 'ms', 'microsoft', 'office',
  'msword', 'ms-word', 'microsoftword', 'microsoft-word',
  'ms-office', 'microsoft-office', 'office-word', 'ms-office-word', 'microsoft-office-word',
];
const formats = [
  [wordAliases, '/brianmorris.docx', ['doc', 'docx']],
  [['pdf', 'adobe', 'acrobat', 'adobe-acrobat', 'adobe-pdf'], '/brianmorris.pdf', ['pdf']],
  [['json', 'json-resume', 'jsonresume'], '/brianmorris.json', ['json']],
];
for (const [names, destination, extensions] of formats) {
  addAliases(names, destination);
  for (const prefix of ['resume', 'cv']) {
    for (const name of names) {
      addAliases([prefix + '-' + name, name + '-' + prefix, prefix + '/' + name], destination);
    }
    addAliases(extensions.map(extension => prefix + '.' + extension), destination);
  }
}
addAliases(['resume', 'cv'], '/brianmorris.pdf');
addAliases(['contact', 'phone', 'email'], '/#contact');
addAliases(['star', 'stars', 'tree', 'trees', 'sky'], '/#stars');
addAliases(['vcf', 'vcard', 'v-card', 'contact.vcf', 'save-contact'], '/brianmorris.vcf');
addAliases(['profile', 'pic', 'picture', 'photo', 'image', 'face'], '/img/Brian-Morris.jpg');
addAliases(['education', 'school', 'academic'], '/#education');
addAliases(['experience', 'work'], '/#experience');
addAliases(['involvement', 'community', 'volunteer'], '/#community');
addAliases(['skill', 'skills', 'talent', 'knowledge'], '/#skills');
addAliases(['project', 'projects'], '/#projects');
addAliases(['about'], '/#about');
addAliases(['home'], '/');

app.get('/', (request, response) => {
  response.render('home');
});

app.use((request, response, next) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') return next();

  let alias;
  try {
    // Accept case, accent, space, underscore, and trailing-slash variants.
    alias = decodeURIComponent(request.path).normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '').toLowerCase()
      .replace(/[ _]+/g, '-').replace(/\/+$/, '');
  } catch {
    return response.status(400).type('text').send('Malformed URL.');
  }
  const destination = aliases.get(alias);
  if (destination) return response.redirect(destination);
  return next();
});

app.use((request, response) => {
  response.status(404).send(
    '<!doctype html><html lang="en"><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1">' +
    '<title>Page not found</title><h1>Page not found</h1>' +
    '<p><a href="/">Return to Brian Morris\'s homepage</a></p></html>'
  );
});

exports.app = onRequest({ region: 'northamerica-northeast2', concurrency: 10 }, app);
