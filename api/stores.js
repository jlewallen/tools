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
                catalog: "/api/stores/" + store.id + "/catalog"
            }
        });
    }

    self.getStores = function(user) {
        return {
          stores: stores.getAll().map(_.curry(createStoreForUser)(user)).value()
        };
    };

    module.exports = self;
})();
