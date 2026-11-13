/* © Brian Morris 2026 | https://brianmorris.info */

const { onRequest } = require('firebase-functions/v2/https');
const express = require('express');
const path = require('node:path');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views', 'pages'));

const aliases = require('./aliases');

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
