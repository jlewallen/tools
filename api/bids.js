var persistence = require("./persistence");
var _ = require("lodash");

(function() {
    var self = {};

    var bids = persistence.bids;
    var items = persistence.items;

    function createBidForUser(user, bid) {
        var item = persistence.items.getById(bid.itemId).first();
        return _.extend({}, bid, {
            item: item,
            urls: {
                acknowledge: "/api/item/" + item.id + "/bids/" + bid.id + "/acknowledge",
                shipped: "/api/item/" + item.id + "/bids/" + bid.id + "/shipped",
                returned: "/api/item/" + item.id + "/bids/" + bid.id + "/returned",
                paid: "/api/item/" + item.id + "/bids/" + bid.id + "/paid",
                sold: "/api/item/" + item.id + "/bids/" + bid.id + "/sold",
                close: "/api/item/" + item.id + "/bids/" + bid.id + "/close",
                cancel: "/api/item/" + item.id + "/bids/" + bid.id + "/cancel",
                thread: "/api/threads/" + bid.thread.id
            }
        });
    }

    self.getBids = function(user, storeId) {
        return {
          bids: bids.getAll().where({ storeId: storeId }).map(_.curry(createBidForUser)(user.get())).value()
        };
    };

    self.acknowledge = function(user, id, bidId) {
        var bid = bids.getById(bidId).first();
        bid.acknowledged = true;
        bids.save(bid);
        return createBidForUser(user.get(), bid);
    };

    self.cancelBid = function(user, id, bidId) {
        var bid = bids.getById(bidId).first();
        var item = items.getById(id).first();
        bid.acknowledged = true;
        bid.winning = false;
        item.sold = false;
        bids.save(bid);
        return createBidForUser(user.get(), bid);
    };

    self.closeBid = function(user, id, bidId) {
        var bid = bids.getById(bidId).first();
        bid.closed = true;
        bid.closed_by = user.get();
        bids.save(bid);
        return createBidForUser(user.get(), bid);
    };

    self.markAsSold = function(user, id, bidId) {
        var bid = bids.getById(bidId).first();
        var item = items.getById(id).first();
        item.sold = true;
        bid.winning = true;
        bids.save(bid);
        return createBidForUser(user.get(), bid);
    };

    self.markAsShipped = function(user, id, bidId) {
        var bid = bids.getById(bidId).first();
        bid.shipped = true;
        bids.save(bid);
        return createBidForUser(user.get(), bid);
    };

    self.markAsReturned = function(user, id, bidId) {
        var bid = bids.getById(bidId).first();
        var item = items.getById(id).first();
        item.sold = false;
        bid.shipped = false;
        bid.winning = false;
        bids.save(bid);
        return createBidForUser(user.get(), bid);
    };

    self.markAsPaid = function(user, id, bidId) {
        var bid = bids.getById(bidId).first();
        bid.paid = true;
        bids.save(bid);
        return createBidForUser(user.get(), bid);
    };

    module.exports = self;
})();
