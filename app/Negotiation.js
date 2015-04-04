/** @jsx React.DOM */
var React = require('react');
var BidStore = require('./BidStore.js');
var ThreadStore = require('./ThreadStore.js');
var Store = require('./Store.js');
var Thread = require('./Thread.js');
var actions = require('./actions.js');

var Negotiation = React.createClass({
  getInitialState: function () {
    return {
      item: Store.getItem(this.props.bid.item.number)
    };
  },

  componentWillMount: function () {
    Store.addChangeListener(this.changeState);
  },

  componentWillUnmount: function () {
    Store.removeChangeListener(this.changeState);
  },

  changeState: function () {
    this.setState({
      item: Store.getItem(this.props.bid.item.number)
    });
  },

  markAsPublic: function() {
    actions.markAsPublic(this.state.item);
  },

  markAsPrivate: function() {
    actions.markAsPrivate(this.state.item);
  },

  markAsAvailable: function() {
    actions.markAsAvailable(this.state.item);
  },

  markAsPaid: function() {
    actions.markAsPaid(this.props.bid);
  },

  markAsSold: function() {
    actions.markAsSold(this.props.bid);
  },

  acknowledge: function() {
    actions.acknowledge(this.props.bid);
  },

  render: function() {
    return (
  <div>
    <Thread id={this.props.bid.thread.id} openReply={this.props.openReply} />
    <div className="row">
      <div className="col xs-12">
        <button className="btn" onClick={this.acknowledge}>Acknowledge</button>
        <button className="btn" onClick={this.markAsAvailable}>Available</button>
        <button className="btn" onClick={this.markAsSold}>Sold</button>
        <button className="btn" onClick={this.markAsPaid}>Paid</button>
        <button className="btn btn-sm" onClick={this.markAsPublic}>Public</button>
        <button className="btn btn-sm" onClick={this.markAsPrivate}>Private</button>
      </div>
    </div>
  </div>
    );
}
});
	
module.exports = Negotiation;
