/* © Brian Morris 2022 | http://brianmorris.info */

const jsonResumePath = '/brianmorris.json';
const docxResumePath = '/brianmorris.docx';
const pdfResumePath = '/brianmorris.pdf';
const vCardPath = '/brianmorris.vcf';
const profilePath = '/img/Brian-Morris.jpg';

const functions = require('firebase-functions');
const express = require('express');
const path = require('path');

const app = express();
app.set('view engine', 'ejs');

app.get('/', (request, response) => {
  response.setHeader("Set-Cookie", "HttpOnly;Secure;SameSite=Strict");
  response.render(path.join(__dirname, 'views', 'pages', 'home'));
});

app.get("/*contact*", (request, response) => {
  response.redirect("/#contact");
});

app.get("/*phone*", (request, response) => {
  response.redirect("/#contact");
});

app.get("/*email*", (request, response) => {
  response.redirect("/#contact");
});

app.get("/*education*", (request, response) => {
  response.redirect("/#education");
});

app.get("/*school*", (request, response) => {
  response.redirect("/#education");
});

app.get("/*academic*", (request, response) => {
  response.redirect("/#education");
});

app.get("/*experience*", (request, response) => {
  response.redirect("/#experience");
});

app.get("/*work*", (request, response) => {
  response.redirect("/#experience");
});

app.get("/*involvement*", (request, response) => {
  response.redirect("/#involvement");
});

app.get("/*community*", (request, response) => {
  response.redirect("/#involvement");
});

app.get("/*volunteer*", (request, response) => {
  response.redirect("/#involvement");
});

app.get("/*skill*", (request, response) => {
  response.redirect("/#skills");
});

app.get("/*talent*", (request, response) => {
  response.redirect("/#skills");
});

app.get("/*knowledge*", (request, response) => {
  response.redirect("/#skills");
});

app.get("/*json", (request, response) => {
  response.redirect(jsonResumePath);
});

app.get("/*doc*", (request, response) => {
  response.redirect(docxResumePath);
});

app.get("/*office*", (request, response) => {
  response.redirect(docxResumePath);
});

app.get("/*word*", (request, response) => {
  response.redirect(docxResumePath);
});

app.get("/*ms*", (request, response) => {
  response.redirect(docxResumePath);
});

app.get("/*microsoft*", (request, response) => {
  response.redirect(docxResumePath);
});

app.get("/*pdf*", (request, response) => {
  response.redirect(pdfResumePath);
});

app.get("/*resume*", (request, response) => {
  response.redirect(pdfResumePath);
});

app.get("/*résumé*", (request, response) => {
  response.redirect(pdfResumePath);
});

app.get("/*r%C3%A9sum%C3%A9*", (request, response) => {
  response.redirect(pdfResumePath);
});

app.get("/*résume*", (request, response) => {
  response.redirect(pdfResumePath);
});

app.get("/*r%C3%A9sume*", (request, response) => {
  response.redirect(pdfResumePath);
});

app.get("/*resumé*", (request, response) => {
  response.redirect(pdfResumePath);
});

app.get("/*resum%C3%A9*", (request, response) => {
  response.redirect(pdfResumePath);
});

app.get("/*star*", (request, response) => {
  response.redirect("/#stars");
});

app.get("/*tree*", (request, response) => {
  response.redirect("/#stars");
});

app.get("/*sky*", (request, response) => {
  response.redirect("/#stars");
});

app.get("/*vcf*", (request, response) => {
  response.redirect(vCardPath);
});

app.get("/*vcard*", (request, response) => {
  response.redirect(vCardPath);
});

app.get("/*profile*", (request, response) => {
  response.redirect(profilePath);
});

app.get("/*pic*", (request, response) => {
  response.redirect(profilePath);
});

app.get("/*photo*", (request, response) => {
  response.redirect(profilePath);
});

app.get("/*image*", (request, response) => {
  response.redirect(profilePath);
});

app.get("/*face*", (request, response) => {
  response.redirect(profilePath);
});

app.get("/*", (request, response) => {
  response.redirect("/#contact");
});

exports.app = functions.https.onRequest(app);