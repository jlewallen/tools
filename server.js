var express = require('express');
var serveStatic = require('serve-static');
var _ = require("lodash");

var app = express();
var catalog = require("./api/catalog");
var bids = require("./api/bids");
var threads = require("./api/threads");

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

app.get('/api/bids/pending', function(req, res) {
  var user = getUser(req);
  return res.send(bids.getBids(user));
});

app.get('/api/catalog', function(req, res) {
  var user = getUser(req);
  return res.send(catalog.getCatalog(user));
});

app.post('/api/item/:number/bid', function(req, res) {
  var user = getUser(req);
  return res.send(catalog.bid(user, req.params.number, req.body));
});

app.post('/api/item/:number/public', function(req, res) {
  var user = getUser(req);
  return res.send(catalog.markAsPublic(user, req.params.number, req.body));
});

app.post('/api/item/:number/private', function(req, res) {
  var user = getUser(req);
  return res.send(catalog.markAsPrivate(user, req.params.number, req.body));
});

app.post('/api/item/:number/bids/:bidId/acknowledge', function(req, res) {
  var user = getUser(req);
  return res.send(bids.acknowledge(user, req.params.number, req.params.bidId, req.body));
});

app.post('/api/item/:number/bids/:bidId/cancel', function(req, res) {
  var user = getUser(req);
  return res.send(bids.cancelBid(user, req.params.number, req.params.bidId, req.body));
});

app.post('/api/item/:number/bids/:bidId/paid', function(req, res) {
  var user = getUser(req);
  return res.send(bids.markAsPaid(user, req.params.number, req.params.bidId, req.body));
});

app.post('/api/item/:number/bids/:bidId/shipped', function(req, res) {
  var user = getUser(req);
  return res.send(bids.markAsShipped(user, req.params.number, req.params.bidId, req.body));
});

app.post('/api/item/:number/bids/:bidId/returned', function(req, res) {
  var user = getUser(req);
  return res.send(bids.markAsReturned(user, req.params.number, req.params.bidId, req.body));
});

app.post('/api/item/:number/bids/:bidId/sold', function(req, res) {
  var user = getUser(req);
  return res.send(bids.markAsSold(user, req.params.number, req.params.bidId, req.body));
});

app.post('/api/item/:number/bids/:bidId/close', function(req, res) {
  var user = getUser(req);
  return res.send(bids.closeBid(user, req.params.number, req.params.bidId, req.body));
});

app.post('/api/item/:number/share', function(req, res) {
  var user = getUser(req);
  return res.send(catalog.shareWith(user, req.params.number, req.body));
});

app.get('/api/threads', function(req, res) {
  var user = getUser(req);
  return res.send(threads.getThreads(user));
});

app.get('/api/threads/:id', function(req, res) {
  var user = getUser(req);
  return res.send(threads.getThread(user, req.params.id));
});

app.post('/api/threads/:id', function(req, res) {
  var user = getUser(req);
  return res.send(threads.replyToThread(user, req.params.id, req.body));
});

app.post('/api/items/:number', function(req, res) {
  var user = getUser(req);
  return res.send(catalog.saveItem(user, req.params.number, req.body));
});

console.log("listening on port 3000");

app.listen(3000);
