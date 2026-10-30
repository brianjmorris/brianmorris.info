const assert = require('node:assert/strict');
const http = require('node:http');
const { before, after, test } = require('node:test');
const { app } = require('../index');

const server = http.createServer(app);
let origin;
before(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  origin = 'http://127.0.0.1:' + server.address().port;
});
after(() => new Promise(resolve => server.close(resolve)));
const request = (url, options = {}) => fetch(origin + url, { redirect: 'manual', ...options });

const groups = [
  [['/doc', '/DOCX', '/docs', '/document', '/documents', '/office', '/word', '/ms', '/microsoft', '/msword', '/ms-word',
    '/ms%20word', '/ms_word', '/microsoft-word', '/microsoft%20office%20word',
    '/resume.doc', '/resume.docx', '/cv.docx', '/resume/word', '/resume/ms-word',
    '/resume-docx', '/docx-resume', '/cv-word', '/r%C3%A9sum%C3%A9/word'], '/brianmorris.docx'],
  [['/pdf', '/PDF/', '/resume', '/cv', '/résumé', '/résume', '/resumé',
    '/adobe', '/acrobat', '/adobe-pdf', '/adobe-acrobat', '/resume.pdf',
    '/cv.pdf', '/resume/pdf', '/pdf-resume'], '/brianmorris.pdf'],
  [['/json', '/JSON/', '/jsonresume', '/json-resume', '/resume.json', '/cv.json',
    '/resume/json', '/resume-json'], '/brianmorris.json'],
  [['/contact', '/phone', '/email'], '/#contact'],
  [['/star', '/stars', '/tree', '/trees', '/sky'], '/#stars'],
  [['/vcf', '/vcard', '/v-card', '/contact.vcf', '/save-contact'], '/brianmorris.vcf'],
  [['/profile', '/pic', '/picture', '/photo', '/image', '/face'], '/img/Brian-Morris.jpg'],
  [['/education', '/school', '/academic'], '/#education'],
  [['/experience', '/work'], '/#experience'],
  [['/involvement', '/community', '/volunteer'], '/#community'],
  [['/skill', '/skills', '/talent', '/knowledge'], '/#skills'],
  [['/project', '/projects'], '/#projects'],
  [['/about'], '/#about'],
  [['/home'], '/'],
];

test('homepage renders without setting a cookie', async () => {
  const response = await request('/');
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('set-cookie'), null);
  const html = await response.text();
  assert.match(html, /<title>Brian Morris<\/title>/);
  assert.match(html, /id="intro"/);
  assert.match(html, /id="stars"/);
  assert.doesNotMatch(html, /<%/);
});

test('document, contact, profile, and section shortcuts reach their intended targets', async () => {
  await Promise.all(groups.flatMap(([urls, target]) => urls.map(async url => {
    const response = await request(encodeURI(decodeURI(url)));
    assert.equal(response.status, 302, url);
    assert.equal(response.headers.get('location'), target, url);
  })));
});

test('query strings and HEAD requests preserve alias behavior', async () => {
  const response = await request('/MS-Word/?download=1', { method: 'HEAD' });
  assert.equal(response.status, 302);
  assert.equal(response.headers.get('location'), '/brianmorris.docx');
  assert.equal(await response.text(), '');
});

test('unrelated paths and missing assets return 404 rather than accidental redirects', async () => {
  await Promise.all(['/unknown-path', '/systems', '/password', '/documentary',
    '/photography', '/old/PDF/download', '/js/missing.js', '/img/missing-photo.png']
    .map(async url => {
      const response = await request(url);
      assert.equal(response.status, 404, url);
      assert.equal(response.headers.get('location'), null, url);
      assert.match(await response.text(), /Return to Brian Morris/);
    }));
});

test('malformed encoded aliases return 400', async () => {
  assert.equal((await request('/%E0%A4%A')).status, 400);
});

test('POST requests do not redirect to downloadable documents', async () => {
  const response = await request('/word', { method: 'POST' });
  assert.equal(response.status, 404);
  assert.equal(response.headers.get('location'), null);
});
