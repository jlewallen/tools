var sqlite3 = require("sqlite3").verbose();
var _ = require("lodash");

var db = new sqlite3.Database(':memory:');
db.serialize(function() {
});

(function() {
  var self = {};

  var catalog = [{
      number: 'wbp389',
      name: 'Interesting W. Pond Radiused Rabbet Plane',
      description: 'This looks like a standard small bench smoother but the sole has been relieved to allow it to be used as a rabbet plane in either the right or left hand direction. Further more, the sole has been radiused to enable it to work these rabbets around corners. I assume it\'s a coach maker\'s plane. The plane has an even, honest patina, including the relieved area long the sole which I believe is factory-original. The blade is long and clean and has no damage. It\'s a small plane measuring 8.5in long with a 1 3/8in wide double iron. It\'s a nice plane by this New Haven, CT maker.',
      price: '3000',
      sold: false,
      public: true,
      pictures: [
        { url: 'http://www.hyperkitten.com/pics/tools/fs/wbp389_1_thumb.jpg' }
      ]
    }, {
      number: 'wbp388',
      name: 'Most Unusual 60 Degree Single-Iron Coffin Smoother',
      description: 'This is the highest angle bench plane I\'ve come across. It\'s marked H.C. Draper at the toe, a name I can\'t find in either the British or American planemakers books. It holds a nice A. Howland 2 1/4in wide single iron. The iron has no pitting and is quite sharp. I\'ve never used a plane with this high of an attack angle so I quickly honed it and gave it a whirl. It worked well, but there\'s a downside to that ultra-high angle.. It makes it really hard to push. The plane is clean and crisp with a freshly flattened sole. The plane once held a double iron- there was a groove in the bed to accept the cap iron\'s nut. It\'s been filled and the bed lined with a thin piece of leather. The plane measures 6.5in overall. It\'s an biding plane for sure.',
      price: '5500',
      sold: false,
      public: true,
      pictures: [
        { url: 'http://www.hyperkitten.com/pics/tools/fs/wbp388_1_thumb.jpg' }
      ]
    }, {
      number: 'wbp373',
      name: 'Tiny British Wooden Router',
      description: 'This is a well-made little router plane with a 1/4in wide blade. It\'s held in place with a screw set in a brass escutcheon. It measures only 4in wide and works quite well for such a simple little router.',
      price: '2500',
      sold: true,
      public: true,
      pictures: [
        { url: 'http://www.hyperkitten.com/pics/tools/fs/wbp373_1_thumb.jpg' }
      ]
  }];

  var bids = [];

  var threads = [];

  function createItemForUser(user, item) {
    var yourBids = _(bids).where({ number: item.number, email: user.email });
    return _.extend({}, item, {
      youAreInterested: yourBids.any(),
      yourBids: yourBids.map(_.curry(createBidForUser)(user)).value(),
      urls: {
        bid: "/api/item/" + item.number + "/bid",
        unavailable: "/api/item/" + item.number + "/unavailable",
        available: "/api/item/" + item.number + "/available",
        public: "/api/item/" + item.number + "/public",
        private: "/api/item/" + item.number + "/private"
      }
    });
  }

  function createBidForUser(user, bid) {
    var item = getItemByNumber(bid.number);
    return _.extend({}, bid, {
      item: item,
      urls: {
        acknowledge: "/api/item/" + item.number + "/bids/" + bid.id + "/acknowledge",
        shipped: "/api/item/" + item.number + "/bids/" + bid.id + "/shipped",
        returned: "/api/item/" + item.number + "/bids/" + bid.id + "/returned",
        paid: "/api/item/" + item.number + "/bids/" + bid.id + "/paid",
        sold: "/api/item/" + item.number + "/bids/" + bid.id + "/sold",
        close: "/api/item/" + item.number + "/bids/" + bid.id + "/close",
        cancel: "/api/item/" + item.number + "/bids/" + bid.id + "/cancel",
        thread: "/api/threads/" + bid.thread.id
      }
    });
  }

  function createThreadForUser(user, thread) {
    return _.extend({}, thread, {
      urls: {
        reply: "/api/threads/" + thread.id
      }
    });
  }

  function newThread(user, id, tags, message) {
    return {
      id: id,
      userIds: [ user.userId ],
      tags: tags,
      created: new Date(),
      unread: true,
      messages: [message]
    };
  }

  function newThreadMessage(user, message) {
    return {
      id: _.uniqueId("thm"),
      timestamp: new Date(),
      sender: user.email,
      body: message,
      unread: true
    };
  }

  function newBid(user, item) {
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

  self.getCatalog = function(user) {
    var canSeePrivate = true;
    return {
      catalog: _(catalog).filter(function(item) {
        return item.public || canSeePrivate;
      }).map(_.curry(createItemForUser)(user)).value()
    };
  };

  self.bid = function(user, number, data) {
    // TODO Prevent duplicates per user.
    var item = getItemByNumber(number);
    var bid = newBid(user, item);
    var tags = [ bid.id, item.number ];
    var thread = newThread(user, bid.thread.id, tags, newThreadMessage(user, data.message));
    bids.push(bid);
    threads.push(thread);
    return createItemForUser(user, item);
  };

  self.getBids = function(user) {
    return {
      bids: _(bids).map(_.curry(createBidForUser)(user)).value()
    };
  };

  function getItemByNumber(number) {
    return _(catalog).where({number: number}).first();
  }

  function getBidById(id) {
    return _(bids).where({id: id}).first();
  }

  self.acknowledge = function(user, number, bidId) {
    var bid = getBidById(bidId);
    bid.acknowledged = true;
    return createBidForUser(user, bid);
  };

  self.markAsPrivate = function(user, number) {
    var item = getItemByNumber(number);
    item.public = false;
    return createItemForUser(user, item);
  };

  self.markAsPublic = function(user, number) {
    var item = getItemByNumber(number);
    item.public = true;
    return createItemForUser(user, item);
  };

  self.markAsUnavailable = function(user, number) {
    throw number;
  };

  self.markAsAvailable = function(user, number) {
    throw number;
  };

  self.cancelBid = function(user, number, bidId) {
    var item = getItemByNumber(number);
    var bid = getBidById(bidId);
    bid.acknowledged = true;
    bid.winning = false;
    item.sold = false;
    return createItemForUser(user, item);
  };

  self.closeBid = function(user, number, bidId) {
    var bid = getBidById(bidId);
    var item = getItemByNumber(number);
    bid.closed = true;
    bid.closed_by = user;
    return createBidForUser(user, bid);
  };

  self.markAsSold = function(user, number, bidId) {
    var bid = getBidById(bidId);
    var item = getItemByNumber(number);
    item.sold = true;
    bid.winning = true;
    return createBidForUser(user, bid);
  };

  self.markAsShipped = function(user, number, bidId) {
    var bid = getBidById(bidId);
    var item = getItemByNumber(number);
    bid.shipped = true;
    return createBidForUser(user, bid);
  };

  self.markAsReturned = function(user, number, bidId) {
    var bid = getBidById(bidId);
    var item = getItemByNumber(number);
    item.sold = false;
    bid.shipped = false;
    bid.winning = false;
    return createBidForUser(user, bid);
  };

  self.markAsPaid = function(user, number, bidId) {
    var bid = getBidById(bidId);
    var item = getItemByNumber(number);
    bid.paid = true;
    return createBidForUser(user, bid);
  };

  self.getThreads = function(user, id) {
    return _(threads).map(_.curry(createThreadForUser)(user)).value();
  };

  self.getThread = function(user, id) {
    return _(threads).where({ id: id }).map(_.curry(createThreadForUser)(user)).first();
  };

  self.replyToThread = function(user, id, data) {
    var thread = _(threads).where({ id: id }).first();
    var message = newThreadMessage(user, data.message);
    thread.messages.push(message);
    _(thread.tags).each(function(tag) {
      var bid = getBidById(tag);
      if (_.isObject(bid)) {
        bid.modified = new Date();
        bid.acknowledged = false;
        bid.closed = false;
        bid.closed_by = null;
      }
    }).value();
    return createThreadForUser(user, thread);
  };

  self.shareWith = function(user, number, body) {
    return {};
  };

  module.exports = self;
})();

