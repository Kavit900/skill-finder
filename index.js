const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const path = require('path');
const jwt = require('jsonwebtoken');
const db = require('./server/database/database');

process.env.SECRET = 'skill-finder';

// tell the app to look for static file in these directories
app.use(express.static('./server/static/'));
app.use(express.static('./client/dist/'));

// tell the app to parse HTTP body messages
app.use(bodyParser.urlencoded({ extended: false }));

// routes
const authRoutes = require('./server/routes/auth');
const apiRoutes = require('./server/routes/api');
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

// start the server
app.listen(process.env.PORT || 8080, () => {
});