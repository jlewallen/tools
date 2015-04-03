var flux = require('flux-react');
var actions = require('./actions.js');
var _ = require("lodash");
var threads = {};

module.exports = flux.createStore({
  threads: [],

  actions: [
    actions.loadThread,
    actions.replyToThread
  ],

  replyToThread: function(thread) {
    this.loadThread(thread);
  },

  loadThread: function(thread) {
    _.remove(this.threads, { id: thread.id });
    this.threads.push(thread);
    this.emitChange();
  },

  exports: {
    getThread: function(id) {
      return _(this.threads).where({ id: id }).first();
    }
  }
});
