var persistence = require("./persistence");
var _ = require("lodash");

(function() {
    var self = {};

    var items = persistence.items;

    function createItemForUser(user, item) {
        if (!_.isObject(user)) {
          return item;
        }
        var yourBids = persistence.bids.getByItemAndUser(item.id, user.id);
        return _.extend({}, item, {
            youAreInterested: yourBids.any(),
            yourBids: yourBids.value(),
            urls: {
                bid: "/api/item/" + item.id + "/bid",
                unavailable: "/api/item/" + item.id + "/unavailable",
                available: "/api/item/" + item.id + "/available",
                public: "/api/item/" + item.id + "/public",
                private: "/api/item/" + item.id + "/private"
            }
        });
    }

    self.getCatalog = function(user, storeId) {
        var canSeePrivate = true;
        return {
            catalog: items.getAll().where({ storeId: storeId }).filter(function(item) {
                return item.public || canSeePrivate;
            }).map(_.curry(createItemForUser)(user.optional())).value()
        };
    };

    self.bid = function(user, id, data) {
        // TODO Prevent duplicates per user.
        var item = items.getById(id).first();
        var bid = persistence.bids.newBid(user.get(), item);
        var tags = [bid.id, item.id];
        var thread = persistence.threads.newThread(user.get(), bid.thread.id, tags, persistence.threads.newThreadMessage(user.get(), data.message));
        persistence.users.createOrUpdateUser(user);
        persistence.bids.save(bid);
        persistence.threads.save(thread);
        return createItemForUser(user.get(), item);
    };

    self.markAsPrivate = function(user, id) {
        var item = items.getById(id).first();
        item.public = false;
        items.save(item);
        return createItemForUser(user.get(), item);
    };

    self.markAsPublic = function(user, id) {
        var item = items.getById(id).first();
        item.public = true;
        items.save(item);
        return createItemForUser(user.get(), item);
    };

    self.saveItem = function(user, id, item) {
        var existing = items.getById(id).first() || {};
        items.save(_.extend(existing, item));
        return createItemForUser(user.get(), item);
    };

    module.exports = self;
})();

