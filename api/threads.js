var persistence = require("./persistence");
var bids = require("./bids");
var _ = require("lodash");

(function() {
    var self = {};

    var threads = persistence.threads;

    function createThreadForUser(user, thread) {
        return _.extend({}, thread, {
            urls: {
                reply: "/api/threads/" + thread.id
            }
        });
    }

    self.getThreads = function(user, id) {
        return threads.getAll().map(_.curry(createThreadForUser)(user.get())).value();
    };

    self.getThread = function(user, id) {
        return threads.getById(id).map(_.curry(createThreadForUser)(user.get())).first();
    };

    self.replyToThread = function(user, id, data) {
        var thread = threads.getById(id).first();
        var message = persistence.threads.newThreadMessage(user.get(), data.message);
        thread.messages.push(message);
        _(thread.tags).each(function(tag) {
            var bid = persistence.bids.getById(tag).first();
            if (_.isObject(bid)) {
                bid.modified = new Date();
                bid.acknowledged = false;
                bid.closed = false;
                bid.closed_by = null;
            }
        }).value();
        threads.save(thread);
        return createThreadForUser(user.get(), thread);
    };

    module.exports = self;
})();
