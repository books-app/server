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


//Getting stuff from the database to render on pages
app.get('/books', (req, res) => {
  client.query(`SELECT * FROM books;`)
    .then(results => res.send(results.rows))
    .catch(console.error);
});

//Getting a single book
app.get('/books/:id', (req, res) => {
  client.query(`SELECT * FROM books WHERE id=${req.params.book_id}`)
    .then(results => res.send(results.rows))
    .catch(console.error);
});

//Adding a book to the database
app.post('/books', bodyParser, (req, res) => {
  let {title, author, isbn, url, description} = req.body;
  client.query(`
      INSERT INTO books(title, author, isbn, url, description) VALUES($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING`,
    [title, author, isbn, url, description]
  )
    .then(res.sendStatus(201))
    .catch(console.error);
});
//Delete a book
app.delete('/books/:id', (req, res) => {
  client.query(`
    DELETE FROM books
    WHERE id=${req.params.id}`)
    .then(() => res.send(204))
    .catch(console.error);
});

//Update a book
app.put('/books', bodyParser, (req, res) => {
  let {title, author, isbn, url, description} = req.body;
  client.query(`
    UPDATE books
    SET title=$1, author=$2, isbn=$3, url=$4, description=$5
    WHERE id=${req.body.book_id}`,
  [title, author, isbn, url, description]
  )
    .then(res.sendStatus(200))
    .catch(console.error)
});


createTable();

app.listen(PORT, () => {
  console.log(`currently listening on ${PORT}`);
});

function createTable() {
  client.query(`
    CREATE TABLE IF NOT EXISTS books(
      id SERIAL PRIMARY KEY,
      title VARCHAR(256),
      author VARCHAR(256),
      isbn VARCHAR(256),
      url VARCHAR(256),
      description text NOT NULL
    );`
  )
  .then(function(response) {
    console.log('books table are done');
  });
};