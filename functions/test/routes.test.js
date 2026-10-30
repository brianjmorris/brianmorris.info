const assert = require('node:assert/strict');
const http = require('node:http');
const { test } = require('node:test');
const { app } = require('../index');

test('homepage renders and existing redirect aliases survive dependency upgrades', async (t) => {
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const origin = `http://127.0.0.1:${server.address().port}`;

  const homepage = await fetch(origin);
  assert.equal(homepage.status, 200);
  const html = await homepage.text();
  assert.match(html, /<title>Brian Morris<\/title>/);
  assert.match(html, /id="intro"/);
  assert.match(html, /id="stars"/);
  assert.doesNotMatch(html, /<%/);

  const groups = [
    [['contact', 'phone', 'email'], '/'],
    [['json'], '/brianmorris.json'],
    [['doc', 'DOCX', 'office', 'word', 'ms', 'microsoft'], '/brianmorris.docx'],
    [['pdf', 'PDF', 'resume', 'résumé', 'résume', 'resumé'], '/brianmorris.pdf'],
    [['star', 'tree', 'sky'], '/#stars'],
    [['vcf', 'vcard'], '/brianmorris.vcf'],
    [['profile', 'pic', 'photo', 'image', 'face'], '/img/Brian-Morris.jpg'],
    [['unknown-path'], '/'],
  ];

  await Promise.all(groups.flatMap(([aliases, target]) =>
    aliases.map(async (alias) => {
      const response = await fetch(`${origin}/${encodeURI(alias)}`, { redirect: 'manual' });
      assert.equal(response.status, 302, alias);
      assert.equal(response.headers.get('location'), target, alias);
    })
  ));

  const nested = await fetch(`${origin}/old/PDF/download`, { redirect: 'manual' });
  assert.equal(nested.headers.get('location'), '/brianmorris.pdf');
});
