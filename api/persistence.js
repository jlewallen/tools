var sqlite3 = require("sqlite3").verbose();
var _ = require("lodash");

(function() {
    var self = {};

    var db = new sqlite3.Database(':memory:');
    db.serialize(function() {
    });

    function Store(name, extra) {
        var self = _.extend(this, extra || {});

        self.data = [];
        self.name = name;

        self.getAll = function() {
            return _(self.data);
        };

        self.getById = function(id) {
            return _(self.data).where({id: id});
        };

        self.getByKey = function(name, key) {
            if (_.isUndefined(key)) {
                throw "No value provided for " + name + " when looking for " + self.name;
            }
            var query = {};
            query[name] = key;
            return _(self.data).where(query);
        };

        self.save = function(entry) {
            if (_.isEmpty(entry.id)) {
              entry.id = _.uniqueId(name);
            }
            var existing = self.getById(entry.id).first();
            if (_.isObject(existing)) {
                _.extend(existing, entry);
            }
            else {
                self.data.push(entry);
            }
        };

        self.saveAll = function(entries) {
            _(entries).each(function(entry) {
                self.save(entry);
            }).value();
        };

        return self;
    }

    self.createStore = function(name, extra) {
        return new Store(name, extra);
    };

    self.items = self.createStore("items", {
        getByNumber: function(number) {
            return this.getByKey('number', number);
        }
    });

    self.bids = self.createStore("bids", {
        getByItemAndUser: function(number, email) {
            return this.getAll().where({number: number, email: email});
        },

        newBid: function(user, item) {
            return {
                id: _.uniqueId("bid"),
                created: new Date(),
                modified: new Date(),
                number: item.number,
                email: user.email,
                won: false,
                shipped: false,
                paid: false,
                closed: false,
                cancelled: false,
                acknowledged: false,
                closed_by: null,
                thread: {
                    id: _.uniqueId("th"),
                }
            };
        }
    });

    self.threads = self.createStore("threads", {
        newThread: function(user, id, tags, message) {
            return {
                id: id,
                userIds: [user.userId],
                tags: tags,
                created: new Date(),
                unread: true,
                messages: [message]
            };
        },

        newThreadMessage: function(user, message) {
            return {
                id: _.uniqueId("thm"),
                timestamp: new Date(),
                sender: user.email,
                body: message,
                unread: true
            };
        }
    });

    self.stores = self.createStore("stores", {
      newStore: function(name) {
        return {
          id: _.uniqueId("store"),
          name: name
        };
      }
    });

    self.users = self.createStore("users", {
      newUser: function(email, name) {
        return {
          id: _.uniqueId("user"),
          email: email,
          name: name
        };
      }
    });

    module.exports = self;

    return self;
})();
