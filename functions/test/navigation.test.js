const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');
const ejs = require('ejs');

async function loadNavigation(hash = '') {
  const html = await ejs.renderFile(path.join(__dirname, '../views/pages/home.ejs'));
  const markup = html.replace(/<!--[\s\S]*?-->/g, '');
  const elements = new Map();
  let focused;
  const focusElement = (id) => { focused = id; };
  for (const [, id] of markup.matchAll(/\bid="([^"]+)"/g)) {
    elements.set(id, {
      hidden: id === 'stars-exit',
      inert: false,
      attributes: {},
      setAttribute(name, value) { this.attributes[name] = value; },
      focus: focusElement.bind(null, id),
    });
  }
  const classes = new Set();
  const events = {};
  const window = {
    location: { hash },
    addEventListener(name, callback) { events[name] = callback; },
  };
  const document = {
    body: {
      classList: {
        toggle(name, enabled) { if (enabled) classes.add(name); else classes.delete(name); },
      },
    },
    getElementById(id) { return elements.get(id) || null; },
    addEventListener(name, callback) { events[name] = callback; },
  };
  const source = fs.readFileSync(path.join(__dirname, '../../src/js/main.js'), 'utf8');
  vm.runInNewContext(source, { window, document });
  events.DOMContentLoaded();
  return {
    elements, classes, window, events,
    focused: () => focused,
    navigate(nextHash) { window.location.hash = nextHash; events.hashchange(); },
  };
}

test('initial load and native section anchors remain intact', async () => {
  await Promise.all(['', '#contact', '#projects', '#education', '#skills', '#unknown'].map(async (hash) => {
    const page = await loadNavigation(hash);
    assert.equal(page.window.location.hash, hash);
    assert.equal(page.classes.has('stars-only'), false);
    assert.equal(page.elements.get('content').inert, false);
    assert.equal(page.elements.get('stars-exit').hidden, true);
    assert.equal(page.focused(), undefined);
  }));
});

test('stars view hides foreground interaction and provides a return to the previous anchor', async () => {
  const page = await loadNavigation('#projects');
  page.navigate('#stars');
  assert.equal(page.classes.has('stars-only'), true);
  assert.equal(page.elements.get('header').inert, true);
  assert.equal(page.elements.get('content').inert, true);
  assert.equal(page.elements.get('stars-exit').hidden, false);
  assert.equal(page.elements.get('stars-exit').attributes.href, '#projects');
  assert.equal(page.focused(), 'stars-exit');

  page.navigate('#projects');
  assert.equal(page.window.location.hash, '#projects');
  assert.equal(page.elements.get('header').inert, false);
  assert.equal(page.elements.get('content').inert, false);
  assert.equal(page.elements.get('stars-exit').hidden, true);
  assert.equal(page.focused(), 'header-title-link');
});

test('direct stars links can be exited with Escape', async () => {
  const page = await loadNavigation('#stars');
  assert.equal(page.elements.get('stars-exit').attributes.href, '#title');
  page.events.keydown({ key: 'Escape' });
  assert.equal(page.window.location.hash, '#title');
  page.events.hashchange();
  assert.equal(page.classes.has('stars-only'), false);
});

test('history navigation restores the page without rewriting section hashes', async () => {
  const page = await loadNavigation();
  page.navigate('#stars');
  page.navigate('');
  assert.equal(page.window.location.hash, '');
  assert.equal(page.classes.has('stars-only'), false);
  page.navigate('#stars');
  page.navigate('#contact');
  assert.equal(page.window.location.hash, '#contact');
  assert.equal(page.classes.has('stars-only'), false);
  page.events.keydown({ key: 'Escape' });
  assert.equal(page.window.location.hash, '#contact');
});
