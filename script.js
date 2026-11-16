let count = 0;
document.getElementById('btn').addEventListener('click', () => {
  count++;
  document.getElementById('out').textContent = `Kliknutí: ${count}`;
});
