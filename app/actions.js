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

module.exports = _.extend({
  refreshCatalog: createActionFunction('refreshCatalog', function() {
    return api({
      url: '/api/catalog'
    });
  }),
  loadThread: createActionFunction('loadThread', function(id) {
    return api({
      url: '/api/threads/' + id
    });
  }),
  refreshBids: createActionFunction('refreshBids', function() {
    return api({
      url: '/api/bids/pending'
    });
  }),
  addBid: createActionFunction('addBid'),
  bidOnItem: createActionFunction('bidOnItem', function(item, message) {
    return api({
      method: 'POST',
      url: item.urls.bid,
      data: JSON.stringify({ message: message })
    });
  }),
  replyToThread: createActionFunction('replyToThread', function(thread, reply) {
    return api({
      method: 'POST',
      url: thread.urls.reply,
      data: JSON.stringify(reply)
    });
  }),
  acknowledge: createActionFunction('acknowledge', function(item) {
    return api({
       method: 'POST',
       url: item.urls.acknowledge
     });
  }),
  markAsAvailable: createActionFunction('markAsAvailable', function(item) {
    return api({
      method: 'POST',
      url: item.urls.available
    });
  }),
  cancelBid: createActionFunction('cancelBid', function(bid) {
    return api({
      method: 'POST',
      url: bid.urls.cancel
    });
  }),
  closeBid: createActionFunction('closeBid', function(bid) {
    return api({
      method: 'POST',
      url: bid.urls.close
    });
  }),
  markAsPaid: createActionFunction('markAsPaid', function(bid) {
    return api({
      method: 'POST',
      url: bid.urls.paid
    });
  }),
  markAsSold: createActionFunction('markAsSold', function(bid) {
    return api({
      method: 'POST',
      url: bid.urls.sold
    });
  }),
  markAsReturned: createActionFunction('markAsReturned', function(bid) {
    return api({
      method: 'POST',
      url: bid.urls.returned
    });
  }),
  markAsShipped: createActionFunction('markAsShipped', function(bid) {
    return api({
      method: 'POST',
      url: bid.urls.shipped
    });
  }),
  markAsPublic: createActionFunction('markAsPublic', function(item) {
    return api({
      method: 'POST',
      url: item.urls.public
    });
  }),
  markAsPrivate: createActionFunction('markAsPrivate', function(item) {
    return api({
      method: 'POST',
      url: item.urls.private
    });
  })
});
