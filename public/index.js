document.querySelector('form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const searchTerm = document.querySelector('input').value;
  const response = await fetch('/api/books/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ searchTerm }),
  });
  const json = await response.json();
  const { title: bookTitle } = json;
  const img = document.createElement('img');
  img.alt = bookTitle;
  img.src = `/images/${bookTitle}.jpg`;
  document.body.appendChild(img);
});
