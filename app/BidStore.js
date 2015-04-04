var flux = require('flux-react');
var actions = require('./actions.js');
var _ = require("lodash");

module.exports = flux.createStore({
  bids: [],

  actions: [
    actions.refreshBids,
    actions.acknowledge
  ],

  updateBid: function(bid) {
    var bid = _(this.bids).where({ id: bid.id }).map(function(i) {
      return _.extend(i, bid); 
    }).first();
    this.emitChange();
    return bid;
  },

  refreshBids: function(data) {
    this.bids = data.bids;
    this.emitChange();
  },

  acknowledge: function(bid) {
    this.updateBid(bid);
  },

  exports: {
    getBids: function() {
      return _(this.bids).value();
    }
  }
});
