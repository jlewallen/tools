/** @jsx React.DOM */
var React = require('react');
var addons = require('react-addons');
var Store = require('./Store.js');
var actions = require('./actions.js');
var _ = require('lodash');

var ItemListing = React.createClass({
  mixins: [addons.LinkedStateMixin],

  getInitialState: function() {
    return {
      item: Store.getItem(this.props.item.number)
    };
  },
  componentWillMount: function() {
    Store.addChangeListener(this.changeState);
  },
  componentWillUnmount: function() {
    Store.removeChangeListener(this.changeState);
  },
  changeState: function() {
    this.setState({
      item: Store.getItem(this.props.item.number)
    });
  },
  addInterest: function() {
    actions.addInterest(this.props.item.number);
  },
  sendInterest: function(ev) {
    ev.preventDefault();
    actions.sendInterest(this.props.item.number, this.state.message);
  },
  renderInterestPanel: function() {
    if (_.isObject(this.state.item.pendingInterest)) {
      return (
        <form onSubmit={this.sendInterest}>
          <textarea valueLink={this.linkState('message')}></textarea>
          <button type="SUBMIT">Send</button>
        </form>
      );
    }
    return (
      <button onClick={this.addInterest}>Want</button>
    );
  },
	render: function() {
		return (
			<div className="item">
        <div className="name">{this.state.item.name}</div>
        <div className="description">{this.state.item.description}</div>
        <div className="price">{this.state.item.price}</div>
        <div >
          {this.renderInterestPanel()}
        </div>
      </div>
		);
	}
	
});
	
module.exports = ItemListing;

