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
var configuration = require("./configuration");

app.use(serveStatic(__dirname + '/build'))
var bodyParser = require('body-parser')
app.use(bodyParser.json());

var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
passport.use(new GoogleStrategy(configuration.auth, function(accessToken, refreshToken, profile, done) {
  done(null, {
    id: profile.id,
    displayName: profile.displayName,
    photos: profile.photos,
    emails: profile.emails
  });
}));
passport.serializeUser(function(user, done) {
  done(null, JSON.stringify(user));
});
passport.deserializeUser(function(obj, done) {
  console.log(obj);
  done(null, JSON.parse(obj));
});

var session = require("cookie-session");
app.use(session({ secret: configuration.sessions.secret }));
/*
var session = require('express-session')
app.use(session({
  secret: configuration.sessions.secret,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));
*/
app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/google', passport.authenticate('google', { scope: 'email' }));
app.get('/auth/google/return', passport.authenticate('google', { failureRedirect: '/' }), function(req, res) {
  res.redirect('/');
});
app.get('/auth/logout', function(req, res) {
  req.session = null;
  res.send({});
});

function getUser(req) {
  console.log(req.user);
  if (!_.isEmpty(req.user)) {
    return {
      has: function() {
        return true;
      },
      optional: function() {
        return req.user;
      },
      get: function() {
        return req.user;
      }
    };
  }
  return {
    has: function() {
      return false;
    },
    optional: function() {
      return null;
    },
    get: function() {
      throw "No user!";
    }
  };
}

function requireUser(user, res, callback) {
  if (!user.has()) {
    return res.status(401).send({ error: "No current user" });
  }
  callback();
}

app.get('/api', function(req, res) {
  var user = getUser(req);
  return res.send({
    urls: {
      stores: "/api/stores"
    }
  });
});

app.get('/api/profile', function(req, res) {
  var user = getUser(req);
  return res.send({ user: user.optional() });
});

app.get('/api/stores', function(req, res) {
  var user = getUser(req);
  return res.send(stores.getStores(user));
});

app.get('/api/stores/:storeId/bids/pending', function(req, res) {
  var user = getUser(req);
  requireUser(user, res, function() {
    return res.send(bids.getBids(user, req.params.storeId));
  });
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
