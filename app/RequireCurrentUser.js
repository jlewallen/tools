/** @jsx React.DOM */
var React = require('react');
var actions = require('./actions');
var CurrentUserStore = require('./CurrentUserStore');
var _ = require('lodash');

var RequireCurrentUser = React.createClass({
  getInitialState: function () {
    return {
      currentUser: CurrentUserStore.getCurrentUser()
    };
  },

  componentWillMount: function() {
    CurrentUserStore.addChangeListener(this.changeState);
    actions.loadCurrentUser();
  },
  
  componentWillUnmount: function() {
    CurrentUserStore.removeChangeListener(this.changeState);
  },

  changeState: function() {
    this.setState(this.getInitialState());
  },

  renderLogin: function() {
    return (
      <div>
        <a href="/auth/google">Login with Google</a>
      </div>
    );
  },

	render: function() {
    if (_.isObject(this.state.currentUser)) {
      return (<div>{this.props.children}</div>);
    }
    return this.renderLogin();
	}
	
});
	
module.exports = RequireCurrentUser;
