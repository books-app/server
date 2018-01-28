'use strict'


const express = require('express');
const cors = require('cors');
const pg = require('pg');
const bodyParser = require('body-parser').urlencoded({extended: true});


const app = express();
const PORT = process.env.PORT;

const client = new pg.Client(process.env.DATABASE_URL);

client.connect();


app.use(cors());


app.get('/books', function(req, res) {
  client.query('SELECT * FROM books;')
  .then(function(data) {
    res.send(data.rows);
  })
  .catch(function(err) {
    console.error(err);
  });
});


app.get('/books/:id', function (req,res) {
  client.query(`SELECT * FROM books WHERE id = ${req.params.id};`)
  .then(function(data){
    res.send(data.rows);
  })
  .catch(function(err) {
    console.log(err);
  });
});


//Adding a book to the database
app.post('//books', function(req, res) {
  client.query(
    `INSERT INTO books (title, author, isbn, url, description)
    VALUES ($1, $2, $3, $4, $5);
    `,
    [
      req.body.title,
      req.body.author,
      req.body.isbn,
      req.body.url,
      req.body.description,
      
    ]
  ) .then(function(data) {
    res.send('insert complete');
  })
  .catch(function(err) {
    console.error(err);
  });
});


app.delete('/books/:id', (req, res) => {
  client.query(`
    DELETE FROM books
    WHERE id=${req.params.id}
    `)
    .then(() => res.send('deleted'))
    .catch(console.error);
});

//Update a book
app.put('/books/:id/edit', function(req, res) {
   client.query(`UPDATE * FROM books WHERE id = ${req.params.id};`)
    .then(() => {
      client.query(`
      UPDATE books
      SET title=$1, author=$2, isbn=$3, url=$4, description=$5
      WHERE id = $6
      `,
      [
        req.body.title,
        req.body.author,
        req.body.isbn,
        req.body.url,
        req.body.description,
        req.params.id
      ]
      )
    })
    .then(() => res.send('Update completed'))
    .catch(console.error);
});

createTable();

app.listen(PORT, () => {
    console.log('SERVER started on port:', PORT);
});

function createTable() {
  client.query(`
    CREATE TABLE IF NOT EXISTS books(
      id SERIAL PRIMARY KEY,
      title VARCHAR(255),
      author VARCHAR(255),
      isbn VARCHAR(255),
      url VARCHAR(255),
      description TEXT NOT NULL
    );`
  )      
};   