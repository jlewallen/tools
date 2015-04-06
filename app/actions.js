var reqwest = require("reqwest");
var createActionFunction = require("./actions-factory");
var _ = require("lodash");

function getHeaders() {
  return {
    'X-Auth-Token': window.localStorage['token']
  };
}

var pending = {};

function api(options) {
  if (_.isNumber(options.concurrency)) {
    if (_.isObject(pending[options.url])) {
      return pending[options.url];
    }
  }
  return pending[options.url] = new Promise(function(resolve, reject) {
    reqwest(_.extend({
      type: 'json',
      contentType: 'application/json',
      headers: getHeaders(),
      success: function(data) {
        delete pending[options.url];
        resolve(data);
      },
      error: function(data) {
        delete pending[options.url];
        reject(data);
      }
    }, options));
  });
}

function createActionFunctions(obj) {
  return _.mapValues(obj, function(value, key) {
    return createActionFunction(key, value);
  });
}

module.exports = createActionFunctions({
  loadRoot: function() {
    return api({
      concurrency: 1,
      url: '/api'
    });
  },
  loadStores: function() {
    return api({
      concurrency: 1,
      url: '/api/stores'
    });
  },
  openStore: true,
  loadCatalog: function(store) {
    if (!_.isObject(store)) {
      console.log("No current store.");
      return Promise.resolve({ });
    }
    return api({
      concurrency: 1,
      url: store.urls.catalog
    });
  },
  loadThread: function(id) {
    return api({
      concurrency: 1,
      url: '/api/threads/' + id
    });
  },
  loadBids: function() {
    return api({
      concurrency: 1,
      url: '/api/bids/pending'
    });
  },
  addBid: true,
  bidOnItem: function(item, message) {
    return api({
      method: 'POST',
      url: item.urls.bid,
      data: JSON.stringify({ message: message })
    });
  },
  replyToThread: function(thread, reply) {
    return api({
      method: 'POST',
      url: thread.urls.reply,
      data: JSON.stringify(reply)
    });
  },
  acknowledge: function(item) {
    return api({
       method: 'POST',
       url: item.urls.acknowledge
     });
  },
  markAsAvailable: function(item) {
    return api({
      method: 'POST',
      url: item.urls.available
    });
  },
  cancelBid: function(bid) {
    return api({
      method: 'POST',
      url: bid.urls.cancel
    });
  },
  closeBid: function(bid) {
    return api({
      method: 'POST',
      url: bid.urls.close
    });
  },
  markAsPaid: function(bid) {
    return api({
      method: 'POST',
      url: bid.urls.paid
    });
  },
  markAsSold: function(bid) {
    return api({
      method: 'POST',
      url: bid.urls.sold
    });
  },
  markAsReturned: function(bid) {
    return api({
      method: 'POST',
      url: bid.urls.returned
    });
  },
  markAsShipped: function(bid) {
    return api({
      method: 'POST',
      url: bid.urls.shipped
    });
  },
  markAsPublic: function(item) {
    return api({
      method: 'POST',
      url: item.urls.public
    });
  },
  markAsPrivate: function(item) {
    return api({
      method: 'POST',
      url: item.urls.private
    });
  },
  saveItem: function(item) {
    var url = _.isEmpty(item.number) ? '/api/items' : '/api/items/' + item.number ;
    return api({
      method: 'POST',
      url: url,
      data: JSON.stringify(item)
    });
  },
});
