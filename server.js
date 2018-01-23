'use strict';
// REVIEW: Check out all of our new arrow function syntax!

const express = require('express');
const pg = require('pg');
const cors = require('cors');

const PORT = process.env.PORT;

const app = express();


const conString = 'https://ryanandrii-booksapp.herokuapp.com';
const client = new pg.Client(conString);

client.connect();
client.on('error', err => {
  console.error(err);
});

app.get('/', (req, res) => response.sendFile('index..html', {root: 'https://ryanandrii-booksapp.herokuapp.com'}));


