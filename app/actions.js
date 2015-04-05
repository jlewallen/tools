var reqwest = require("reqwest");
var createActionFunction = require("./actions-factory");
var _ = require("lodash");

function getHeaders() {
  return {
    'X-Auth-Token': window.localStorage['token']
  };
}

function api(options) {
  return new Promise(function(resolve, reject) {
    reqwest(_.extend({
      type: 'json',
      contentType: 'application/json',
      url: '/api/catalog',
      headers: getHeaders(),
      success: function(data) {
        resolve(data);
      },
      error: function(data) {
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
  refreshCatalog: function() {
    return api({
      url: '/api/catalog'
    });
  },
  loadThread: function(id) {
    return api({
      url: '/api/threads/' + id
    });
  },
  refreshBids: function() {
    return api({
      url: '/api/bids/pending'
    });
  },
  addBid: _.noop,
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
