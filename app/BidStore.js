var flux = require('flux-react');
var actions = require('./actions.js');
var _ = require("lodash");

module.exports = flux.createStore({
  bids: [],

  actions: [
    actions.loadBids,
    actions.acknowledge,
    actions.cancelBid,
    actions.closeBid,
    actions.markAsPaid,
    actions.markAsShipped,
    actions.markAsReturned,
    actions.markAsSold
  ],

  updateBid: function(bid) {
    var bid = _(this.bids).where({ id: bid.id }).map(function(i) {
      return _.extend(i, bid); 
    }).first();
    this.emitChange();
    return bid;
  },

  loadBids: function(data) {
    this.bids = data.bids;
    this.emitChange();
  },

  acknowledge: function(bid) {
    this.updateBid(bid);
  },

  cancelBid: function(bid) {
    this.updateBid(bid);
  },

  closeBid: function(bid) {
    this.updateBid(bid);
  },

  markAsPaid: function(bid) {
    this.updateBid(bid);
  },

  markAsShipped: function(bid) {
    this.updateBid(bid);
  },

  markAsReturned: function(bid) {
    this.updateBid(bid);
  },
  
  markAsSold: function(bid) {
    this.updateBid(bid);
  },

  exports: {
    getBids: function() {
      return _(this.bids).value();
    }
  }
});
