var flux = require('flux-react');
var actions = require('./actions.js');
var _ = require("lodash");

function getSavedStore() {
  var saved = window.localStorage["currentStore"];
  if (_.isString(saved)) {
    return JSON.parse(saved);
  }
  return null;
}

module.exports = flux.createStore({
  stores: [],
  currentStore: getSavedStore(),

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
    window.localStorage["currentStore"] = JSON.stringify(store);
    this.emitChange();
  },

  leaveStore: function() {
    this.currentStore = window.localStorage["currentStore"] = null;
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
