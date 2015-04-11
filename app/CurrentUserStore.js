var flux = require('flux-react');
var actions = require('./actions.js');
var _ = require("lodash");

module.exports = flux.createStore({
  currentUser: undefined,

  actions: [
    actions.loadCurrentUser,
    actions.logout
  ],

  loadCurrentUser: function(data) {
    this.currentUser = data.user;
    this.emitChange();
  },

  logout: function(data) {
  },

  exports: {
    getCurrentUser: function() {
      return this.currentUser;
    }
  }
});
