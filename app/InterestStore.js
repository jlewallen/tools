var flux = require('flux-react');
var actions = require('./actions.js');
var _ = require("lodash");

module.exports = flux.createStore({
  interests: [],

  actions: [
    actions.refreshInterests,
    actions.acknowledge
  ],

  refreshInterests: function(data) {
    this.interests = data.interests;
    this.emitChange();
  },

  acknowledge: function() {
  },

  exports: {
    getUnacknowledgedInterests: function() {
      return _(this.interests).value();
    }
  }
});
