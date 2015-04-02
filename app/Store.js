var flux = require('flux-react');
var actions = require('./actions.js');
var _ = require("lodash");

module.exports = flux.createStore({
  catalog: [],

  actions: [
    actions.refreshCatalog,
    actions.addInterest,
    actions.sendInterest
  ],

  refreshCatalog: function(data) {
    this.catalog = data.catalog;
    this.emitChange();
  },

  addInterest: function(number) {
    var item = _(this.catalog).where({ number: number }).first();
    item.pendingInterest = { message: '' };
    this.emitChange();
  },

  sendInterest: function(interest) {
    var item = _(this.catalog).where({ number: interest.number }).first();
    item.pendingInterest = null;
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
