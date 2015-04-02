/** @jsx React.DOM */
var React = require('react');
var Store = require('./Store.js');
var ItemListing = require("./ItemListing.js");
var actions = require('./actions.js');

var App = React.createClass({
  getInitialState: function () {
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
    return (<ItemListing item={item}/>);
  },

	render: function() {
		return (
			<div>
        {this.state.catalog.map(this.renderItem)}
      </div>
		);
	}
	
});
	
module.exports = App;
