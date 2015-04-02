var express = require('express');
var connect = require('connect');
var serveStatic = require('serve-static');
var _ = require("lodash");

var app = express();
var api = require("./api/catalog");

app.use(serveStatic(__dirname + '/build'))
var bodyParser = require('body-parser')
app.use(bodyParser.json());

function getUser(req) {
  var authToken = req.get("X-Auth-Token");
  if (_.isString(authToken)) {
    return JSON.parse(authToken);
  }
  return { userId: null, email: null };
}

app.get('/api/interests/pending', function(req, res) {
  var user = getUser(req);
  return res.send(api.getInterests(user));
});

app.get('/api/catalog', function(req, res) {
  var user = getUser(req);
  return res.send(api.getCatalog(user));
});

app.post('/api/item/:number/interested', function(req, res) {
  var user = getUser(req);
  return res.send(api.addInterest(user, req.params.number, req.body));
});

console.log("listening on port 3000");

app.listen(3000);
