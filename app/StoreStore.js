var flux = require('flux-react');
var actions = require('./actions.js');
var _ = require("lodash");

module.exports = flux.createStore({
  stores: [],
  currentStore: null,

  actions: [
    actions.loadStores,
    actions.openStore,
    actions.leaveStore
  ],

  loadStores: function(data) {
    this.stores = data.stores;
    this.emitChange();
  },

  openStore: function(store) {
    this.currentStore = store;
    this.emitChange();
  },

  leaveStore: function() {
    this.currentStore = null;
    this.emitChange();
  },

  exports: {
    getStores: function() {
      return _(this.stores).value();
    },

    getCurrentStore: function() {
      return this.currentStore;
    }
  }
});
