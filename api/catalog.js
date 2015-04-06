var persistence = require("./persistence");
var _ = require("lodash");

(function() {
    var self = {};

    var items = persistence.items;

    function createItemForUser(user, item) {
        var yourBids = persistence.bids.getByItemAndUser(item.number, user.email);
        return _.extend({}, item, {
            youAreInterested: yourBids.any(),
            yourBids: yourBids.value(),
            urls: {
                bid: "/api/item/" + item.number + "/bid",
                unavailable: "/api/item/" + item.number + "/unavailable",
                available: "/api/item/" + item.number + "/available",
                public: "/api/item/" + item.number + "/public",
                private: "/api/item/" + item.number + "/private"
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

    self.bid = function(user, number, data) {
        // TODO Prevent duplicates per user.
        var item = items.getByNumber(number).first();
        var bid = persistence.bids.newBid(user, item);
        var tags = [bid.id, item.number];
        var thread = persistence.threads.newThread(user, bid.thread.id, tags, persistence.threads.newThreadMessage(user, data.message));
        persistence.bids.save(bid);
        persistence.threads.save(thread);
        return createItemForUser(user, item);
    };

    self.markAsPrivate = function(user, number) {
        var item = items.getByNumber(number).first();
        item.public = false;
        items.save(item);
        return createItemForUser(user, item);
    };

    self.markAsPublic = function(user, number) {
        var item = items.getByNumber(number).first();
        item.public = true;
        items.save(item);
        return createItemForUser(user, item);
    };

    self.saveItem = function(user, number, item) {
        var existing = items.getByNumber(number).first() || {};
        items.save(_.extend(existing, item));
        return createItemForUser(user, item);
    };

    module.exports = self;
})();

