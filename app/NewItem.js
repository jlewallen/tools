/** @jsx React.DOM */
var React = require('react');
var ItemEditor = require("./ItemEditor");

var NewItem = React.createClass({
  getInitialState: function () {
    return {
    };
  },

	render: function() {
		return (
      <div>
        <ItemEditor />
      </div>
		);
	}
	
});
	
module.exports = NewItem;
