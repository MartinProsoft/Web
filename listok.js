function tomorrowInBratislava(now) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Bratislava',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(now);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return new Date(Date.UTC(Number(values.year), Number(values.month) - 1, Number(values.day) + 1))
    .toISOString().slice(0, 10);
}

document.getElementById('show-trains').addEventListener('click', () => {
  const date = tomorrowInBratislava(new Date());
  const url = new URL('https://regiojet.sk/');
  url.search = new URLSearchParams({
    departureDate: date,
    tariffs: 'CZECH_STUDENT_PASS_26',
    fromLocationId: '10202003',
    fromLocationType: 'CITY',
    toLocationId: '49584000',
    toLocationType: 'CITY'
  });
  document.getElementById('travel-date').textContent = date.split('-').reverse().join('.');
  document.getElementById('regiojet-link').href = url.href;
  document.getElementById('train-results').hidden = false;
});
