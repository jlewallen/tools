/** @jsx React.DOM */
var React = require('react');
var addons = require('react-addons');
var CatalogStore = require('./CatalogStore');
var actions = require('./actions');
var BidPanel = require('./BidPanel');
var _ = require('lodash');

var ItemListing = React.createClass({
  mixins: [addons.LinkedStateMixin],

  getInitialState: function() {
    return {
      item: CatalogStore.getItem(this.props.number)
    };
  },
  componentWillMount: function() {
    CatalogStore.addChangeListener(this.changeState);
  },
  componentWillUnmount: function() {
    CatalogStore.removeChangeListener(this.changeState);
  },
  changeState: function() {
    this.setState(this.getInitialState());
  },
  renderLowerPanel: function() {
    if (!this.state.item.sold) {
        return (<BidPanel number={this.props.number} />);
    }
    else {
      return (<b>This item has been sold.</b>);
    }
  },
  renderAdminPanel: function() {
    return (
      <div>
        <a href={'#/items/' + this.state.item.number}>Edit</a>
      </div>
    );
    return (<div></div>);
  },
	render: function() {
		return (
			<div>
        <div className="row">
          <div className="name">{this.state.item.name}</div>
          <div className="description">{this.state.item.description}</div>
          <div className="price">{this.state.item.price}</div>
          {this.renderLowerPanel()}
          {this.renderAdminPanel()}
        </div>
      </div>
		);
	}
	
});
	
module.exports = ItemListing;

