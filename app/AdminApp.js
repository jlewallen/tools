/** @jsx React.DOM */
var React = require('react');
var InterestsDashboard = require("./InterestsDashboard");

var AdminApp = React.createClass({
  getInitialState: function () {
    return {
    };
  },

	render: function() {
		return (
      <div>
        <h3>Administration</h3>
        <InterestsDashboard/>
      </div>
		);
	}
	
});
	
module.exports = AdminApp;
