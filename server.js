var express = require('express');
var connect = require('connect');
var serveStatic = require('serve-static');

var app = express();

app.use(serveStatic(__dirname + '/build'))

app.get('/api/catalog', function(req, res) {
  return res.send({});
});

app.post('/api/item/:number/interested', function(req, res) {
  return res.send({});
});

console.log("listening on port 3000");

app.listen(3000);
