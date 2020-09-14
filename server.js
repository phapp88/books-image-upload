const bodyParser = require('body-parser');
const express = require('express');
const fetch = require('node-fetch');
const fs = require('fs');

express()
  .use(express.static('public'))
  .use(bodyParser.json())
  .post('/api/books', async (req, res) => {
    const { searchTerm } = req.body;
    const url = `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&maxResults=1&projection=lite`;
    const booksRes = await fetch(url);
    const booksJson = await booksRes.json();
    const { title, imageLinks } = booksJson.items[0].volumeInfo;
    const imgUrl = imageLinks.smallThumbnail;
    const imgRes = await fetch(imgUrl);
    const imgFile = fs.createWriteStream(`public/images/${title}.jpg`);
    imgRes.body.pipe(imgFile);
    res.send({ title });
  })
  .listen(process.env.PORT || 3000);
