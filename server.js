const bodyParser = require('body-parser');
const express = require('express');
const fetch = require('node-fetch');
const { deleteImage, getAllImages, uploadImage } = require('./s3');

express()
  .use(express.static('public'))
  .use(bodyParser.json())
  .delete('/api/books/:title', async (req, res) => {
    const { title } = req.params;
    deleteImage(title);
    res.send();
  })
  .get('/api/books', async (req, res) => {
    const images = await getAllImages();
    const imgEls = images.map((image) => {
      const { buffer, title } = image;
      const alt = title;
      const src = `data:image/jpeg;base64,${buffer.toString('base64')}`;
      return { alt, src };
    });
    res.send({ imgEls });
  })
  .post('/api/books', async (req, res) => {
    const { searchTerm } = req.body;
    const url = `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&maxResults=1&projection=lite`;
    const booksRes = await fetch(url);
    const booksJson = await booksRes.json();
    const { title, imageLinks } = booksJson.items[0].volumeInfo;
    const imgUrl = imageLinks.smallThumbnail;
    const imgRes = await fetch(imgUrl);
    const imgBuf = await imgRes.buffer();
    uploadImage(`${title}.jpg`, imgBuf);
    const imgSrc = `data:image/jpeg;base64,${imgBuf.toString('base64')}`;
    res.send({ alt: title, src: imgSrc });
  })
  .listen(process.env.PORT || 3000);
