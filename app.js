const express = require('express');

const indexRouter = require('./src/routes/index');
const partiesRouter = require('./src/routes/partie');

//const logger = require('morgan');             // log requests to the console (express4)
const bodyParser = require('body-parser');    // pull information from HTML POST (express4)

const app = express();

//app.use(logger('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended': 'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json

app.use(express.static('./src/public'));

app.use('/api/local', indexRouter);
app.use('/api/parties', partiesRouter);

module.exports = app;
