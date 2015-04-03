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
    var token = JSON.parse(authToken);
    return _.extend(token, {
      admin: token.userId == 'jlewallen'
    });
  }
  return { userId: null, email: null, admin: false };
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
  return res.send(api.interested(user, req.params.number, req.body));
});

app.post('/api/item/:number/available', function(req, res) {
  var user = getUser(req);
  return res.send(api.markAsAvailable(user, req.params.number, req.body));
});

app.post('/api/item/:number/public', function(req, res) {
  var user = getUser(req);
  return res.send(api.markAsPublic(user, req.params.number, req.body));
});

app.post('/api/item/:number/private', function(req, res) {
  var user = getUser(req);
  return res.send(api.markAsPrivate(user, req.params.number, req.body));
});

app.post('/api/item/:number/unavailable', function(req, res) {
  var user = getUser(req);
  return res.send(api.markAsUnavailable(user, req.params.number, req.body));
});

app.post('/api/item/:number/interests/:interestId/acknowledge', function(req, res) {
  var user = getUser(req);
  return res.send(api.acknowledge(user, req.params.number, req.params.interestId, req.body));
});

app.post('/api/item/:number/interests/:interestId/uninterested', function(req, res) {
  var user = getUser(req);
  return res.send(api.uninterested(user, req.params.number, req.params.interestId, req.body));
});

app.post('/api/item/:number/interests/:interestId/paid', function(req, res) {
  var user = getUser(req);
  return res.send(api.markAsPaid(user, req.params.number, req.params.interestId, req.body));
});

app.post('/api/item/:number/interests/:interestId/sold', function(req, res) {
  var user = getUser(req);
  return res.send(api.markAsSold(user, req.params.number, req.params.interestId, req.body));
});

app.post('/api/item/:number/interests/:interestId/close', function(req, res) {
  var user = getUser(req);
  return res.send(api.uninterested(user, req.params.number, req.params.interestId, req.body));
});

app.post('/api/item/:number/share', function(req, res) {
  var user = getUser(req);
  return res.send(api.shareWith(user, req.params.number, req.body));
});

app.get('/api/threads', function(req, res) {
  var user = getUser(req);
  return res.send(api.getThreads(user));
});

app.get('/api/threads/:id', function(req, res) {
  var user = getUser(req);
  return res.send(api.getThread(user, req.params.id));
});

app.post('/api/threads/:id', function(req, res) {
  var user = getUser(req);
  return res.send(api.replyToThread(user, req.params.id, req.body));
});

console.log("listening on port 3000");

app.listen(3000);
