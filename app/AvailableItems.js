/** @jsx React.DOM */
var React = require('react');
var Store = require('./Store.js');
var ItemListing = require("./ItemListing.js");
var AvailableItems = require("./AvailableItems.js");
var actions = require('./actions.js');

var AvailableItems = React.createClass({
  getInitialState: function () {
    actions.refreshCatalog();

    return {
      catalog: Store.getCatalog()
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
      catalog: Store.getCatalog()
    });
  },

  renderItem: function(item) {
    return (<ItemListing number={item.number}/>);
  },

	render: function() {
		return (
			<div className="container">
        {this.state.catalog.map(this.renderItem)}
      </div>
		);
	}
});
	
module.exports = AvailableItems;
