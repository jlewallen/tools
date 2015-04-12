var persistence = require("./persistence");
var bids = require("./bids");
var _ = require("lodash");

(function() {
    var self = {};

    var threads = persistence.threads;

    function createMessageForUser(users, user, message) {
        return _.extend({}, message, {
            sender: users[message.senderId]
        });
    }

    function createThreadForUser(user, thread) {
        var userIds = _(thread.messages).pluck("senderId").uniq();
        var users = userIds.map(persistence.users.getById).map(function(i) {
          return i.first();
        }).groupBy('id').value();
        return _.extend({}, thread, {
            messages: _(thread.messages).map(_.curry(createMessageForUser)(users, user)).value(),
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
        persistence.users.createOrUpdateUser(user);
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
