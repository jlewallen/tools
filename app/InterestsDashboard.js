/** @jsx React.DOM */
var React = require('react');
var UnacknowledgedInterests = require('./UnacknowledgedInterests.js');
var ListOfInterests = require('./ListOfInterests.js');
var actions = require('./actions.js');

var InterestsDashboard = React.createClass({
  getInitialState: function () {
    return {
    };
  },

  componentWillMount: function () {
  },

  componentWillUnmount: function () {
  },

  changeState: function () {
    this.setState({
    });
  },

  // Somethings tells me this may be a bad practice?
  unacknowledged: function(interest) {
    return !interest.acknowledged;
  },

  pending: function(interest) {
    return !interest.closed && interest.acknowledged;
  },

	render: function() {
		return (
			<div>
        <h3>Unseed or Unacknowledged</h3>
        <ListOfInterests filter={this.unacknowledged} openReply={true} />

        <h3>Pending</h3>
        <ListOfInterests filter={this.pending}  openReply={false} />
      </div>
		);
	}
});
	
module.exports = InterestsDashboard;
