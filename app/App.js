/** @jsx React.DOM */
var React = require('react');
var AvailableItems = require("./AvailableItems.js");
var StoreChooser = require('./StoreChooser');

var App = React.createClass({
  getInitialState: function () {
    return {
    };
  },

	render: function() {
		return (
      <div>
        <StoreChooser>
          <AvailableItems />
        </StoreChooser>
      </div>
		);
	}
	
});
	
module.exports = App;
