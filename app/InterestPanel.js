/** @jsx React.DOM */
var React = require('react');
var addons = require('react-addons');
var Store = require('./Store.js');
var actions = require('./actions.js');
var _ = require('lodash');

var InterestPanel = React.createClass({
  mixins: [addons.LinkedStateMixin],

  getInitialState: function() {
    return {
      item: Store.getItem(this.props.number)
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
      item: Store.getItem(this.props.number)
    });
  },
  addInterest: function() {
    actions.addInterest(this.props.number);
  },
  sendInterest: function(ev) {
    ev.preventDefault();
    actions.sendInterest(this.props.number, this.state.message);
  },
	render: function() {
    if (this.state.item.sold) {
      return (<div>This item has been sold.</div>);
    }
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
	}
	
});
	
module.exports = InterestPanel;

