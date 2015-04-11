var persistence = require("./persistence");
var _ = require("lodash");

(function() {
    var self = {};

    var stores = persistence.stores;

    stores.saveAll([{
      name: 'Store #1',
      description: ''
    }, {
      name: 'Store #2',
      description: ''
    }]);

    function createStoreForUser(user, store) {
        return _.extend({}, store, {
            urls: {
                catalog: "/api/stores/" + store.id + "/catalog",
                bids: "/api/stores/" + store.id + "/bids/pending"
            }
        });
    }

    self.getStores = function(user) {
        return {
          stores: stores.getAll().map(_.curry(createStoreForUser)(user.optional())).value()
        };
    };

    module.exports = self;
})();
