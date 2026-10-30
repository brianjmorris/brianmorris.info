/* © Brian Morris 2026 | http://brianmorris.info */

const jsonResumePath = '/brianmorris.json';
const docxResumePath = '/brianmorris.docx';
const pdfResumePath = '/brianmorris.pdf';
const vCardPath = '/brianmorris.vcf';
const profilePath = '/img/Brian-Morris.jpg';

const { onRequest } = require("firebase-functions/v2/https");
const express = require('express');
const path = require('path');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views', 'pages'));

app.get('/', (request, response) => {
  response.setHeader("Set-Cookie", "HttpOnly;Secure;SameSite=Strict");
  response.render('home');
});

app.get(/^\/.*contact.*\/?$/i, (request, response) => {
  // response.redirect("/#contact");
  response.redirect("/");
});

app.get(/^\/.*phone.*\/?$/i, (request, response) => {
  // response.redirect("/#contact");
  response.redirect("/");
});

app.get(/^\/.*email.*\/?$/i, (request, response) => {
  // response.redirect("/#contact");
  response.redirect("/");
});

// app.get("/*education*", (request, response) => {
//   response.redirect("/#education");
// });

// app.get("/*school*", (request, response) => {
//   response.redirect("/#education");
// });

// app.get("/*academic*", (request, response) => {
//   response.redirect("/#education");
// });

// app.get("/*experience*", (request, response) => {
//   response.redirect("/#experience");
// });

// app.get("/*work*", (request, response) => {
//   response.redirect("/#experience");
// });

// app.get("/*involvement*", (request, response) => {
//   response.redirect("/#involvement");
// });

// app.get("/*community*", (request, response) => {
//   response.redirect("/#involvement");
// });

// app.get("/*volunteer*", (request, response) => {
//   response.redirect("/#involvement");
// });

// app.get("/*skill*", (request, response) => {
//   response.redirect("/#skills");
// });

// app.get("/*talent*", (request, response) => {
//   response.redirect("/#skills");
// });

// app.get("/*knowledge*", (request, response) => {
//   response.redirect("/#skills");
// });

app.get(/^\/.*json\/?$/i, (request, response) => {
  response.redirect(jsonResumePath);
});

app.get(/^\/.*doc.*\/?$/i, (request, response) => {
  response.redirect(docxResumePath);
});

app.get(/^\/.*office.*\/?$/i, (request, response) => {
  response.redirect(docxResumePath);
});

app.get(/^\/.*word.*\/?$/i, (request, response) => {
  response.redirect(docxResumePath);
});

app.get(/^\/.*ms.*\/?$/i, (request, response) => {
  response.redirect(docxResumePath);
});

app.get(/^\/.*microsoft.*\/?$/i, (request, response) => {
  response.redirect(docxResumePath);
});

app.get(/^\/.*pdf.*\/?$/i, (request, response) => {
  response.redirect(pdfResumePath);
});

app.get(/^\/.*resume.*\/?$/i, (request, response) => {
  response.redirect(pdfResumePath);
});

app.get(/^\/.*résumé.*\/?$/i, (request, response) => {
  response.redirect(pdfResumePath);
});

app.get(/^\/.*r%C3%A9sum%C3%A9.*\/?$/i, (request, response) => {
  response.redirect(pdfResumePath);
});

app.get(/^\/.*résume.*\/?$/i, (request, response) => {
  response.redirect(pdfResumePath);
});

app.get(/^\/.*r%C3%A9sume.*\/?$/i, (request, response) => {
  response.redirect(pdfResumePath);
});

app.get(/^\/.*resumé.*\/?$/i, (request, response) => {
  response.redirect(pdfResumePath);
});

app.get(/^\/.*resum%C3%A9.*\/?$/i, (request, response) => {
  response.redirect(pdfResumePath);
});

app.get(/^\/.*star.*\/?$/i, (request, response) => {
  response.redirect("/#stars");
});

app.get(/^\/.*tree.*\/?$/i, (request, response) => {
  response.redirect("/#stars");
});

app.get(/^\/.*sky.*\/?$/i, (request, response) => {
  response.redirect("/#stars");
});

app.get(/^\/.*vcf.*\/?$/i, (request, response) => {
  response.redirect(vCardPath);
});

app.get(/^\/.*vcard.*\/?$/i, (request, response) => {
  response.redirect(vCardPath);
});

app.get(/^\/.*profile.*\/?$/i, (request, response) => {
  response.redirect(profilePath);
});

app.get(/^\/.*pic.*\/?$/i, (request, response) => {
  response.redirect(profilePath);
});

app.get(/^\/.*photo.*\/?$/i, (request, response) => {
  response.redirect(profilePath);
});

app.get(/^\/.*image.*\/?$/i, (request, response) => {
  response.redirect(profilePath);
});

app.get(/^\/.*face.*\/?$/i, (request, response) => {
  response.redirect(profilePath);
});

app.get(/^\/.*\/?$/i, (request, response) => {
  response.redirect("/");
});

exports.app = onRequest({ region: "northamerica-northeast2", concurrency: 10 }, app);
