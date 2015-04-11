/** @jsx React.DOM */
var React = require('react');
var CatalogStore = require('./CatalogStore.js');
var ItemListing = require('./ItemListing');
var AvailableItems = require('./AvailableItems');
var actions = require('./actions');
var _ = require('lodash');

var AvailableItems = React.createClass({
  getInitialState: function () {
    var catalog = _(CatalogStore.getCatalog());
    return {
      available: catalog.where({ sold: false }).value(),
      sold: catalog.where({ sold: true }).value()
    };
  },

  componentWillMount: function () {
    CatalogStore.addChangeListener(this.changeState);
  },

  componentWillUnmount: function () {
    CatalogStore.removeChangeListener(this.changeState);
  },

  changeState: function () {
    this.setState(this.getInitialState());
  },

  renderItem: function(item) {
    return (<ItemListing key={item.id} number={item.number}/>);
  },

	render: function() {
		return (
      <div>
        <h3>Available Items</h3>
        <div className="container">
          {this.state.available.map(this.renderItem)}
        </div>

        <h3>Sold Items</h3>
        <div className="container">
          {this.state.sold.map(this.renderItem)}
        </div>
      </div>
		);
	}
});
	
module.exports = AvailableItems;
