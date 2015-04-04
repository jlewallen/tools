var sqlite3 = require("sqlite3").verbose();
var _ = require("lodash");

var db = new sqlite3.Database(':memory:');
db.serialize(function() {
  // db.run("CREATE TABLE items ()");
  // db.run("CREATE TABLE interests ()");
});

(function() {
  var self = {};

  var catalog = [{
      number: 'wbp389',
      name: 'Interesting W. Pond Radiused Rabbet Plane',
      description: 'This looks like a standard small bench smoother but the sole has been relieved to allow it to be used as a rabbet plane in either the right or left hand direction. Further more, the sole has been radiused to enable it to work these rabbets around corners. I assume it\'s a coach maker\'s plane. The plane has an even, honest patina, including the relieved area long the sole which I believe is factory-original. The blade is long and clean and has no damage. It\'s a small plane measuring 8.5in long with a 1 3/8in wide double iron. It\'s a nice plane by this New Haven, CT maker.',
      price: '3000',
      sold: false,
      available: true,
      paid: false,
      public: true,
      pictures: [
        { url: 'http://www.hyperkitten.com/pics/tools/fs/wbp389_1_thumb.jpg' }
      ]
    }, {
      number: 'wbp388',
      name: 'Most Unusual 60 Degree Single-Iron Coffin Smoother',
      description: 'This is the highest angle bench plane I\'ve come across. It\'s marked H.C. Draper at the toe, a name I can\'t find in either the British or American planemakers books. It holds a nice A. Howland 2 1/4in wide single iron. The iron has no pitting and is quite sharp. I\'ve never used a plane with this high of an attack angle so I quickly honed it and gave it a whirl. It worked well, but there\'s a downside to that ultra-high angle.. It makes it really hard to push. The plane is clean and crisp with a freshly flattened sole. The plane once held a double iron- there was a groove in the bed to accept the cap iron\'s nut. It\'s been filled and the bed lined with a thin piece of leather. The plane measures 6.5in overall. It\'s an interesting plane for sure.',
      price: '5500',
      sold: false,
      available: true,
      paid: false,
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
      available: true,
      paid: false,
      public: true,
      pictures: [
        { url: 'http://www.hyperkitten.com/pics/tools/fs/wbp373_1_thumb.jpg' }
      ]
  }];

  var interests = [];

  var threads = [];

  function createItemForUser(user, item) {
    var yourInterests = _(interests).where({ number: item.number, email: user.email });
    return _.extend({}, item, {
      youAreInterested: yourInterests.any(),
      yourInterests: yourInterests.map(_.curry(createInterestForUser)(user)).value(),
      urls: {
        interested: "/api/item/" + item.number + "/interested",
        unavailable: "/api/item/" + item.number + "/unavailable",
        available: "/api/item/" + item.number + "/available",
        public: "/api/item/" + item.number + "/public",
        private: "/api/item/" + item.number + "/private"
      }
    });
  }

  function createInterestForUser(user, interest) {
    var item = getItemByNumber(interest.number);
    return _.extend({}, interest, {
      item: item,
      urls: {
        acknowledge: "/api/item/" + item.number + "/interests/" + interest.id + "/acknowledge",
        paid: "/api/item/" + item.number + "/interests/" + interest.id + "/paid",
        sold: "/api/item/" + item.number + "/interests/" + interest.id + "/sold",
        close: "/api/item/" + item.number + "/interests/" + interest.id + "/close",
        uninterested: "/api/item/" + item.number + "/interests/" + interest.id + "/uninterested",
        thread: "/api/threads/" + interest.thread.id
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

  function newThread(user, id, message, tags) {
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

  function newInterest(user, item) {
    return {
      id: _.uniqueId("in"),
      created: new Date(),
      number: item.number,
      email: user.email,
      closed: false,
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

  self.interested = function(user, number, data) {
    // TODO Prevent duplicates per user.
    var item = getItemByNumber(number);
    var interest = newInterest(user, item);
    var thread = newThread(user, interest.thread.id, newThreadMessage(user, data.message));
    interests.push(interest);
    threads.push(thread);
    return createItemForUser(user, item);
  };

  self.uninterested = function(user, number) {
    var item = getItemByNumber(number);
    return createItemForUser(user, item);
  };

  self.getInterests = function(user) {
    return {
      interests: _(interests).map(_.curry(createInterestForUser)(user)).value()
    };
  };

  function getItemByNumber(number) {
    return _(catalog).where({number: number}).first();
  }

  function getInterestById(id) {
    return _(interests).where({id: id}).first();
  }

  self.acknowledge = function(user, number, interestId) {
    var interest = getInterestById(interestId);
    interest.acknowledged = true;
    return createInterestForUser(user, interest);
  };

  self.markAsSold = function(user, number, interestId) {
    var item = getItemByNumber(number);
    item.sold = true;
    item.available = false;
    return createItemForUser(user, item);
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
    var item = getItemByNumber(number);
    item.sold = false;
    item.available = false;
    return createItemForUser(user, item);
  };

  self.markAsAvailable = function(user, number) {
    var item = getItemByNumber(number);
    item.sold = false;
    item.available = true;
    return createItemForUser(user, item);
  };

  self.markAsPaid = function(user, number, interestId) {
    var item = getItemByNumber(number);
    item.sold = true;
    item.paid = true;
    return createItemForUser(user, item);
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
    return createThreadForUser(user, thread);
  };

  self.shareWith = function(user, number, body) {
    return {};
  };

  module.exports = self;
})();

