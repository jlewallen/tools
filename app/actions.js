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
  refreshInterests: createActionFunction('refreshInterests', function() {
    return api({
      url: '/api/interests/pending'
    });
  }),
  addInterest: createActionFunction('addInterest'),
  sendInterest: createActionFunction('sendInterest', function(number, message) {
    return api({
      method: 'POST',
      url: '/api/item/' + number + '/interested',
      data: JSON.stringify({ message: message })
    });
  })
});
