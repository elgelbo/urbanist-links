const express = require('express');
const app = express();
const path = require('path');
const routes = require('./routes/index');
app.set('views', path.join(__dirname, 'views')); // this is the folder for ejs files
app.set('view engine', 'pug');

// serves up static files from the public folder. Anything in public/ will just be served up as the file it is
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

module.exports = app;