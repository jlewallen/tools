/** @jsx React.DOM */
var React = require('react');
var UnacknowledgedInterests = require("./UnacknowledgedInterests");

var AdminApp = React.createClass({
  getInitialState: function () {
    return {
    };
  },

	render: function() {
		return (
      <div>
        <h3>Administration</h3>

        <UnacknowledgedInterests />
      </div>
		);
	}
	
});
	
module.exports = AdminApp;
