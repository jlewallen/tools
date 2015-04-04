var flux = require('flux-react');
var actions = require('./actions.js');
var _ = require("lodash");

module.exports = flux.createStore({
  catalog: [],

  actions: [
    actions.refreshCatalog,
    actions.addBid,
    actions.bidOnItem,
    actions.markAsAvailable,
    actions.markAsPaid,
    actions.markAsSold,
    actions.markAsPublic,
    actions.markAsPrivate
  ],

  refreshCatalog: function(data) {
    this.catalog = data.catalog;
    this.emitChange();
  },

  addBid: function(number) {
    var item = _(this.catalog).where({ number: number }).first();
    item.pendingBid = { message: '' };
    this.emitChange();
  },

  bidOnItem: function(item) {
    var item = _(this.catalog).where({ number: item.number }).map(function(i) {
      return _.extend(i, item); 
    }).first();
    item.pendingBid = null;
    item.youAreInterested = true;
    this.emitChange();
  },

  updateItem: function(item) {
    var item = _(this.catalog).where({ number: item.number }).map(function(i) {
      return _.extend(i, item); 
    });
    this.emitChange();
  },

  markAsAvailable: function(item) {
    this.updateItem(item);
  },

  markAsPaid : function(item) {
    this.updateItem(item);
  },

  markAsSold: function(item) {
    this.updateItem(item);
  },

  markAsPublic: function(item) {
    this.updateItem(item);
  },

  markAsPrivate: function(item) {
    this.updateItem(item);
  },

  exports: {
    getCatalog: function() {
      return this.catalog;
    },
    getItem: function(number) {
      return _(this.catalog).where({ number: number }).first();
    }
  }
});
