/** @jsx React.DOM */
var React = require('react');
var BidsDashboard = require("./BidsDashboard");

var AdminApp = React.createClass({
  getInitialState: function () {
    return {
    };
  },

	render: function() {
		return (
      <div>
        <h3>Administration</h3>
        <BidsDashboard/>
      </div>
		);
	}
	
});
	
module.exports = AdminApp;
