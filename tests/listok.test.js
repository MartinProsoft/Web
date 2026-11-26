const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

function loadPage() {
  const elements = {
    'show-trains': { addEventListener(type, handler) { this.handler = handler; } },
    'train-results': { hidden: true },
    'travel-date': {},
    'regiojet-link': {}
  };
  const context = vm.createContext({
    Date, Intl, URL, URLSearchParams,
    document: { getElementById: id => elements[id] }
  });
  const source = fs.readFileSync(path.join(__dirname, '../listok.js'), 'utf8');
  vm.runInContext(source, context);
  return { context, elements };
}

test('tomorrow uses the Bratislava calendar across midnight and DST', () => {
  const { context } = loadPage();
  assert.equal(context.tomorrowInBratislava(new Date('2026-12-31T23:30:00Z')), '2027-01-02');
  assert.equal(context.tomorrowInBratislava(new Date('2026-03-28T23:30:00Z')), '2026-03-30');
  assert.equal(context.tomorrowInBratislava(new Date('2026-10-25T00:30:00Z')), '2026-10-26');
});

test('click reveals a dated student search without claiming a price', () => {
  const { context, elements } = loadPage();
  elements['show-trains'].handler();
  const url = new URL(elements['regiojet-link'].href);
  assert.equal(elements['train-results'].hidden, false);
  assert.equal(url.searchParams.get('departureDate'), context.tomorrowInBratislava(new Date()));
  assert.equal(url.searchParams.get('tariffs'), 'CZECH_STUDENT_PASS_26');
  assert.equal(url.searchParams.get('fromLocationId'), '10202003');
  assert.equal(url.searchParams.get('toLocationId'), '49584000');
  assert.match(elements['travel-date'].textContent, /^\d{2}\.\d{2}\.\d{4}$/);
});
