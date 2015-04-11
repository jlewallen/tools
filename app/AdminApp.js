/** @jsx React.DOM */
var React = require('react');
var BidsDashboard = require("./BidsDashboard");
var StoreChooser = require('./StoreChooser');
var RequireCurrentUser  = require("./RequireCurrentUser");

var AdminApp = React.createClass({
  getInitialState: function () {
    return {
    };
  },

	render: function() {
		return (
      <div>
        <RequireCurrentUser>
          <StoreChooser>
            <h3>Administration</h3>
            <BidsDashboard/>
          </StoreChooser>
        </RequireCurrentUser>
      </div>
		);
	}
	
});
	
module.exports = AdminApp;
