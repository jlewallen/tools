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
  refreshInterests: createActionFunction('refreshInterests', function() {
    return api({
      url: '/api/interests/pending'
    });
  }),
  addInterest: createActionFunction('addInterest'),
  interested: createActionFunction('interested', function(item, message) {
    return api({
      method: 'POST',
      url: item.urls.interested,
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
  markAsAvailable: createActionFunction('markAsAvailable', function(item) {
    return api({
      method: 'POST',
      url: item.urls.available
    });
  }),
  markAsPaid: createActionFunction('markAsPaid', function(interest) {
    return api({
      method: 'POST',
      url: interest.urls.paid
    });
  }),
  markAsSold: createActionFunction('markAsSold', function(interest) {
    return api({
      method: 'POST',
      url: interest.urls.sold
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
