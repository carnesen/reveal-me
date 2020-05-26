'use strict';

var path = require('path');

var express = require('express');

var morgan = require('morgan');

var app = express();

app.use(morgan('dev'));

var port = process.env.PORT || 3000;

app.use('/', express.static(path.join(__dirname, 'public')));

if (require.main === module) {
  app.listen(port, function() {
    console.log('Listening on http://localhost:' + port);
  });
}
