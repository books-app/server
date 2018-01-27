'use strict'

//These are our dependencies
const express = require('express');
const cors = require('cors');
const pg = require('pg');
const bodyParser = require('body-parser').urlencoded({extended: true});

//Setting up our applications
const app = express();
const PORT = process.env.PORT;
const CLIENT_URL = process.env.CLIENT_URL;
const TOKEN = process.env.TOKEN;

//Setting up our database
const client = new pg.Client(process.env.DATABASE_URL);
// const client = new pg.Client('postgres://localhost:5432/books_app');
client.connect();
client.on('error', err => console.error(err));

//Instantiating middleware
app.use(cors());

//Endpoints below here

//Getting stuff from the database to render on pages
app.get('/books', (req, res) => {
  client.query(`SELECT * FROM books;`)
    .then(results => res.send(results.rows))
    .catch(console.error);
});

//Getting a single book
app.get('/books/:id', (req, res) => {
  client.query(`SELECT * FROM books WHERE book_id=${req.params.id}`)
    .then(results => res.send(results.rows))
    .catch(console.error);
});

//Adding a book to the database
app.post('books', bodyParser, (req, res) => {
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
    WHERE book_id=${req.params.book_id}`)
    .then(() => res.send(204))
    .catch(console.error);
});

//Update a book
app.put('/books', bodyParser, (req, res) => {
  let {title, author, isbn, url, description} = req.body;
  client.query(`
    UPDATE books
    SET title=$1, author=$2, isbn=$3, url=$4, description=$5
    WHERE book_id=${req.body.book_id}`,
  [title, author, isbn, url, description]
  )
    .then(res.sendStatus(200))
    .catch(console.error)
});

//This is a redirect
app.get('*', (req, res) => res.redirect(CLIENT_URL));

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));