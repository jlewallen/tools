/** @jsx React.DOM */
var React = require('react');
var BidStore = require('./BidStore.js');
var Negotiation = require('./Negotiation.js');
var actions = require('./actions.js');
var _ = require("lodash");

var ListOfBids = React.createClass({
  getInitialState: function () {
    return {
      bids: _(BidStore.getBids()).filter(this.props.filter).value()
    };
  },

  componentWillMount: function () {
    BidStore.addChangeListener(this.changeState);
    actions.refreshBids();
    actions.refreshCatalog();
  },

  componentWillUnmount: function () {
    BidStore.removeChangeListener(this.changeState);
  },

  changeState: function () {
    this.setState(this.getInitialState());
  },

  renderBid: function(bid) {
    return (<Negotiation key={bid.id} bid={bid} openReply={this.props.openReply} />);
  },

	render: function() {
    if (!_.any(this.state.bids)) {
        return (<div>None</div>);
    }
		return (
			<div>
        {this.state.bids.map(this.renderBid)}
      </div>
		);
	}
});
	
module.exports = ListOfBids;
