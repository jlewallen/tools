/** @jsx React.DOM */
var React = require('react');
var ListOfBids = require('./ListOfBids.js');
var actions = require('./actions.js');

var BidsDashboard = React.createClass({
  getInitialState: function () {
    return {
    };
  },

  // Somethings tells me this may be a bad practice?
  unacknowledged: function(bid) {
    return !bid.closed && !bid.acknowledged;
  },

  pending: function(bid) {
    return !bid.closed && bid.acknowledged;
  },

	render: function() {
		return (
			<div>
        <h3>Unseed or Unacknowledged</h3>
        <ListOfBids filter={this.unacknowledged} openReply={true} />

        <h3>Pending</h3>
        <ListOfBids filter={this.pending} openReply={false} />
      </div>
		);
	}
});
	
module.exports = BidsDashboard;
