var persistence = require("./persistence");
var _ = require("lodash");

(function() {
    var self = {};

    var items = persistence.items;

    function createItemForUser(user, item) {
        var yourBids = persistence.bids.getByItemAndUser(item.id, user.email);
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
            }).map(_.curry(createItemForUser)(user)).value()
        };
    };

    self.bid = function(user, id, data) {
        // TODO Prevent duplicates per user.
        var item = items.getById(id).first();
        var bid = persistence.bids.newBid(user, item);
        var tags = [bid.id, item.id];
        var thread = persistence.threads.newThread(user, bid.thread.id, tags, persistence.threads.newThreadMessage(user, data.message));
        persistence.bids.save(bid);
        persistence.threads.save(thread);
        return createItemForUser(user, item);
    };

    self.markAsPrivate = function(user, id) {
        var item = items.getById(id).first();
        item.public = false;
        items.save(item);
        return createItemForUser(user, item);
    };

    self.markAsPublic = function(user, id) {
        var item = items.getById(id).first();
        item.public = true;
        items.save(item);
        return createItemForUser(user, item);
    };

    self.saveItem = function(user, id, item) {
        var existing = items.getById(id).first() || {};
        items.save(_.extend(existing, item));
        return createItemForUser(user, item);
    };

    module.exports = self;
})();

