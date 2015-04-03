/** @jsx React.DOM */
var React = require('react');
var InterestStore = require('./InterestStore.js');
var ThreadStore = require('./ThreadStore.js');
var Store = require('./Store.js');
var Thread = require('./Thread.js');
var actions = require('./actions.js');

var Negotiation = React.createClass({
  getInitialState: function () {
    return {
      item: Store.getItem(this.props.interest.item.number)
    };
  },

  componentWillMount: function () {
    Store.addChangeListener(this.changeState);
  },

  componentWillUnmount: function () {
    Store.removeChangeListener(this.changeState);
  },

  changeState: function () {
                   console.log(Store.getItem(this.props.interest.item.number));
    this.setState({
      item: Store.getItem(this.props.interest.item.number)
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
    actions.markAsPaid(this.props.interest);
  },

  markAsSold: function() {
    actions.markAsSold(this.props.interest);
  },

	render: function() {
		return (
      <div>
        <Thread id={this.props.interest.thread.id} />
        <div className="row">
          <div className="col xs-12">
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
