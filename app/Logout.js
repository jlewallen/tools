/** @jsx React.DOM */
var React = require('react');
var actions = require('./actions');
var CurrentUserStore = require('./CurrentUserStore');
var _ = require('lodash');

var Logout = React.createClass({
  getInitialState: function () {
    return {
      currentUser: CurrentUserStore.getCurrentUser()
    };
  },

  componentWillMount: function() {
    CurrentUserStore.addChangeListener(this.changeState);
    actions.logout();
  },
  
  componentWillUnmount: function() {
    CurrentUserStore.removeChangeListener(this.changeState);
  },

  changeState: function() {
    this.setState(this.getInitialState());
  },

	render: function() {
    return (<div>{this.props.children}</div>);
	}
	
});
	
module.exports = Logout;
