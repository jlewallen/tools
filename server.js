var express = require('express');
var serveStatic = require('serve-static');
var _ = require("lodash");

var app = express();
var catalog = require("./api/catalog");
var bids = require("./api/bids");
var threads = require("./api/threads");
var users = require("./api/users");
var stores = require("./api/stores");
var data = require("./api/data");

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

app.get('/api', function(req, res) {
  var user = getUser(req);
  return res.send({
    urls: {
      stores: "/api/stores"
    }
  });
});

app.get('/api/stores', function(req, res) {
  var user = getUser(req);
  return res.send(stores.getStores(user));
});

app.get('/api/stores/:storeId/catalog', function(req, res) {
  var user = getUser(req);
  return res.send(catalog.getCatalog(user, req.params.storeId));
});

app.post('/api/item/:id/bid', function(req, res) {
  var user = getUser(req);
  return res.send(catalog.bid(user, req.params.id, req.body));
});

app.post('/api/item/:id/public', function(req, res) {
  var user = getUser(req);
  return res.send(catalog.markAsPublic(user, req.params.id, req.body));
});

app.post('/api/item/:id/private', function(req, res) {
  var user = getUser(req);
  return res.send(catalog.markAsPrivate(user, req.params.id, req.body));
});

app.post('/api/item/:id/bids/:bidId/acknowledge', function(req, res) {
  var user = getUser(req);
  return res.send(bids.acknowledge(user, req.params.id, req.params.bidId, req.body));
});

app.post('/api/item/:id/bids/:bidId/cancel', function(req, res) {
  var user = getUser(req);
  return res.send(bids.cancelBid(user, req.params.id, req.params.bidId, req.body));
});

app.post('/api/item/:id/bids/:bidId/paid', function(req, res) {
  var user = getUser(req);
  return res.send(bids.markAsPaid(user, req.params.id, req.params.bidId, req.body));
});

app.post('/api/item/:id/bids/:bidId/shipped', function(req, res) {
  var user = getUser(req);
  return res.send(bids.markAsShipped(user, req.params.id, req.params.bidId, req.body));
});

app.post('/api/item/:id/bids/:bidId/returned', function(req, res) {
  var user = getUser(req);
  return res.send(bids.markAsReturned(user, req.params.id, req.params.bidId, req.body));
});

app.post('/api/item/:id/bids/:bidId/sold', function(req, res) {
  var user = getUser(req);
  return res.send(bids.markAsSold(user, req.params.id, req.params.bidId, req.body));
});

app.post('/api/item/:id/bids/:bidId/close', function(req, res) {
  var user = getUser(req);
  return res.send(bids.closeBid(user, req.params.id, req.params.bidId, req.body));
});

app.post('/api/item/:id/share', function(req, res) {
  var user = getUser(req);
  return res.send(catalog.shareWith(user, req.params.id, req.body));
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

app.post('/api/items/:id', function(req, res) {
  var user = getUser(req);
  return res.send(catalog.saveItem(user, req.params.id, req.body));
});

console.log("listening on port 3000");

app.listen(3000);
