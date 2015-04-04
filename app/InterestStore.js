var flux = require('flux-react');
var actions = require('./actions.js');
var _ = require("lodash");

module.exports = flux.createStore({
  interests: [],

  actions: [
    actions.refreshInterests,
    actions.acknowledge
  ],

  updateInterest: function(interest) {
    var interest = _(this.interests).where({ id: interest.id }).map(function(i) {
      return _.extend(i, interest); 
    }).first();
    this.emitChange();
    return interest;
  },

  refreshInterests: function(data) {
    this.interests = data.interests;
    this.emitChange();
  },

  acknowledge: function(interest) {
    this.updateInterest(interest);
  },

  exports: {
    getInterests: function() {
      return _(this.interests).value();
    }
  }
});
