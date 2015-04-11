/** @jsx React.DOM */
var React = require('react');
var StoreChooser = require('./StoreChooser');
var ItemEditor = require("./ItemEditor");

var NewItem = React.createClass({
  getInitialState: function () {
    return {
    };
  },

	render: function() {
		return (
      <div>
        <StoreChooser>
          <ItemEditor />
        </StoreChooser>
      </div>
		);
	}
	
});
	
module.exports = NewItem;
