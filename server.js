'use strict';

const cors = require('cors');
const express = require('express');
const pg = require('pg');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT;

const connectionString = process.env.DATABASE_URL;
const client = new pg.Client(connectionString);
client.connect();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/books', function(request, response) {
  client.query('SELECT * FROM books;')
  .then(function(data) {
    response.send(data);
  })
  .catch(function(err) {
    console.error(err);
  });
});

app.post('/books', function(request, response) {
  client.query(`
    INSERT INTO books( book_title, author, isbn, pic_url, description )
    VALUES($1, $2, $3, $4, $5, );
    `,
    [
      request.body.book_title,
      request.body.author,
      request.body.ISBN,
      request.body.pic_url,
      request.body.descr,

    ]
  )
  .then(function(data) {
    response.redirect('/books');
  })
  .catch(function(err) {
    console.error(err);
  });
});

createTable();

app.listen(PORT, () => {
  console.log(`currently listening on ${PORT}`);
});

function createTable() {
  client.query(`
    CREATE TABLE IF NOT EXISTS books(
      id SERIAL PRIMARY KEY,
      book_title VARCHAR(256),
      author VARCHAR(256),
      ISBN VARCHAR(256),
      pic_url VARCHAR(256),
      descr VARCHAR(256)
    );`
  )
  .then(function(response) {
    console.log('books table are done');
  });
};