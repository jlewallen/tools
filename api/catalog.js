var persistence = require("./persistence");
var _ = require("lodash");

(function() {
    var self = {};

    var items = persistence.items;

    items.saveAll([{
        number: 'wbp389',
        name: 'Interesting W. Pond Radiused Rabbet Plane',
        description: 'This looks like a standard small bench smoother but the sole has been relieved to allow it to be used as a rabbet plane in either the right or left hand direction. Further more, the sole has been radiused to enable it to work these rabbets around corners. I assume it\'s a coach maker\'s plane. The plane has an even, honest patina, including the relieved area long the sole which I believe is factory-original. The blade is long and clean and has no damage. It\'s a small plane measuring 8.5in long with a 1 3/8in wide double iron. It\'s a nice plane by this New Haven, CT maker.',
        price: '3000',
        sold: false,
        public: true,
        pictures: [
            {url: 'http://www.hyperkitten.com/pics/tools/fs/wbp389_1_thumb.jpg'}
        ]
    }, {
        number: 'wbp388',
        name: 'Most Unusual 60 Degree Single-Iron Coffin Smoother',
        description: 'This is the highest angle bench plane I\'ve come across. It\'s marked H.C. Draper at the toe, a name I can\'t find in either the British or American planemakers books. It holds a nice A. Howland 2 1/4in wide single iron. The iron has no pitting and is quite sharp. I\'ve never used a plane with this high of an attack angle so I quickly honed it and gave it a whirl. It worked well, but there\'s a downside to that ultra-high angle.. It makes it really hard to push. The plane is clean and crisp with a freshly flattened sole. The plane once held a double iron- there was a groove in the bed to accept the cap iron\'s nut. It\'s been filled and the bed lined with a thin piece of leather. The plane measures 6.5in overall. It\'s an biding plane for sure.',
        price: '5500',
        sold: false,
        public: true,
        pictures: [
            {url: 'http://www.hyperkitten.com/pics/tools/fs/wbp388_1_thumb.jpg'}
        ]
    }, {
        number: 'wbp373',
        name: 'Tiny British Wooden Router',
        description: 'This is a well-made little router plane with a 1/4in wide blade. It\'s held in place with a screw set in a brass escutcheon. It measures only 4in wide and works quite well for such a simple little router.',
        price: '2500',
        sold: true,
        public: true,
        pictures: [
            {url: 'http://www.hyperkitten.com/pics/tools/fs/wbp373_1_thumb.jpg'}
        ]
    }]);

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

    self.getCatalog = function(user) {
        var canSeePrivate = true;
        return {
            catalog: items.getAll().filter(function(item) {
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

    module.exports = self;
})();

