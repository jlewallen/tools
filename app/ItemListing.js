/** @jsx React.DOM */
var React = require('react');
var addons = require('react-addons');
var Store = require('./Store.js');
var actions = require('./actions.js');
var BidPanel = require('./BidPanel.js');
var _ = require('lodash');

var ItemListing = React.createClass({
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
  renderLowerPanel: function() {
    if (!this.state.item.sold) {
        return (<BidPanel number={this.props.number} />);
    }
    else {
      return (<b>This item has been sold.</b>);
    }
  },
	render: function() {
		return (
			<div>
        <div className="row">
          <div className="name">{this.state.item.name}</div>
          <div className="description">{this.state.item.description}</div>
          <div className="price">{this.state.item.price}</div>
          {this.renderLowerPanel()}
        </div>
      </div>
		);
	}
	
});
	
module.exports = ItemListing;

