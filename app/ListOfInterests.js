/** @jsx React.DOM */
var React = require('react');
var InterestStore = require('./InterestStore.js');
var Negotiation = require('./Negotiation.js');
var actions = require('./actions.js');
var _ = require("lodash");

var ListOfInterests = React.createClass({
  getInitialState: function () {
    actions.refreshInterests();
    actions.refreshCatalog();

    return {
      interests: _(InterestStore.getInterests()).filter(this.props.filter).value()
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
      interests: _(InterestStore.getInterests()).filter(this.props.filter).value()
    });
  },

  renderInterest: function(interest) {
    return (<Negotiation key={interest.id} interest={interest} openReply={this.props.openReply} />);
  },

	render: function() {
    if (!_.any(this.state.interests)) {
        return (<div>None</div>);
    }
		return (
			<div>
        {this.state.interests.map(this.renderInterest)}
      </div>
		);
	}
});
	
module.exports = ListOfInterests;
