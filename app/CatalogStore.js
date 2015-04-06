var flux = require('flux-react');
var actions = require('./actions.js');
var _ = require("lodash");

module.exports = flux.createStore({
  catalog: [],

  actions: [
    actions.openStore,
    actions.loadCatalog,
    actions.addBid,
    actions.bidOnItem,
    actions.markAsPublic,
    actions.markAsPrivate,
    actions.saveItem
  ],

  openStore: function(store) {
  },

  loadCatalog: function(data) {
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

  markAsPublic: function(item) {
    this.updateItem(item);
  },

  markAsPrivate: function(item) {
    this.updateItem(item);
  },

  saveItem: function(item) {
    this.updateItem(item);
  },

  updateItem: function(item) {
    var item = _(this.catalog).where({ number: item.number }).map(function(i) {
      return _.extend(i, item); 
    }).first();
    this.emitChange();
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
