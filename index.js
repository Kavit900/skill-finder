const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// tell the app to look for static file in these directories
app.use(express.static('./server/static/'));
app.use(express.static('./client/dist/'));

// tell the app to parse HTTP body messages
app.use(bodyParser.urlencoded({ extended: false }));

// routes
const authRoutes = require('./server/routes/auth');
app.use('/auth', authRoutes);

// start the server
app.listen(8080, () => {
});