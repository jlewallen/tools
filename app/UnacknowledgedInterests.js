/** @jsx React.DOM */
var React = require('react');
var InterestStore = require('./InterestStore.js');
var Negotiation = require('./Negotiation.js');
var actions = require('./actions.js');

var UnacknowledgedInterests = React.createClass({
  getInitialState: function () {
    actions.refreshInterests();
    actions.refreshCatalog();

    return {
      interests: InterestStore.getUnacknowledgedInterests()
    };
  },

  componentWillMount: function () {
    InterestStore.addChangeListener(this.changeState);
  },

  componentWillUnmount: function () {
    InterestStore.removeChangeListener(this.changeState);
  },

  changeState: function () {
    this.setState({
      interests: InterestStore.getUnacknowledgedInterests()
    });
  },

  renderInterest: function(interest) {
    return (<div> <Negotiation interest={interest} /> </div>);
  },

	render: function() {
		return (
			<div>
        {this.state.interests.map(this.renderInterest)}
      </div>
		);
	}
});
	
module.exports = UnacknowledgedInterests;
