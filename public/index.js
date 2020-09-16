const showImage = (alt, src) => {
  const div = document.createElement('div');
  div.classList.add('book');

  const img = document.createElement('img');
  img.alt = alt;
  img.src = src;

  const btn = document.createElement('button');
  btn.textContent = 'Delete';
  btn.type = 'button';
  btn.classList.add('delete-btn');
  btn.addEventListener('click', async (event) => {
    const { parentElement: div, previousElementSibling: img } = event.target;
    fetch(`/api/books/${img.alt}`, { method: 'DELETE' });
    div.remove();
  });

  div.appendChild(img);
  div.appendChild(btn);
  document.querySelector('.books').appendChild(div);
};

const showAllBooks = async () => {
  const getBooksRes = await fetch('/api/books');
  const booksJson = await getBooksRes.json();
  booksJson.imgEls.forEach((imgEl) => {
    const { alt, src } = imgEl;
    showImage(alt, src);
  });
};

document.querySelector('form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const searchTerm = document.querySelector('input').value;
  const postBookRes = await fetch('/api/books/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ searchTerm }),
  });
  const bookJson = await postBookRes.json();
  const { alt, src } = bookJson;
  showImage(alt, src);
});

showAllBooks();
