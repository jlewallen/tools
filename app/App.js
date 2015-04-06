/** @jsx React.DOM */
var React = require('react');
var AvailableItems = require("./AvailableItems.js");

var App = React.createClass({
  getInitialState: function () {
    return {
    };
  },

	render: function() {
		return (
      <div>
        <AvailableItems />
      </div>
		);
	}
	
});
	
module.exports = App;
