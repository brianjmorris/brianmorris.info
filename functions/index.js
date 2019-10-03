/* © Brian Morris 2019 | http://brianmorris.info */

const functions = require('firebase-functions');
const express = require('express');
const path = require('path');

const app = express();
app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname, 'views', 'home.html'));
});

app.get('/resume', (request, response) => {
  redirectToResume(response);
});

app.get('/résumé', (request, response) => {
  redirectToResume(response);
});

app.get('/' + encodeURIComponent('résumé'), (request, response) => {
  redirectToResume(response);
});

app.get('/r%C3%A9sum%C3%A9', (request, response) => {
  redirectToResume(response);
});

app.get('/résume', (request, response) => {
  redirectToResume(response);
});

app.get('/' + encodeURIComponent('résume'), (request, response) => {
  redirectToResume(response);
});

app.get('/r%C3%A9sume', (request, response) => {
  redirectToResume(response);
});

app.get('/resumé', (request, response) => {
  redirectToResume(response);
});

app.get('/' + encodeURIComponent('resumé'), (request, response) => {
  redirectToResume(response);
});

app.get('/resum%C3%A9', (request, response) => {
  redirectToResume(response);
});

function redirectToResume(response) {
  response.redirect('/Brian+Morris+Resume.pdf');
}

exports.app = functions.https.onRequest(app);