/** @jsx React.DOM */
var React = require('react');
var ThreadStore = require('./ThreadStore.js');
var addons = require('react-addons');
var actions = require('./actions.js');
var _ = require("lodash");

var Thread = React.createClass({
  mixins: [addons.LinkedStateMixin],

  getInitialState: function () {
    actions.loadThread(this.props.id);

    return {
      thread: ThreadStore.getThread(this.props.id)
    };
  },

  componentWillMount: function () {
    ThreadStore.addChangeListener(this.changeState);
  },

  componentWillUnmount: function () {
    ThreadStore.removeChangeListener(this.changeState);
  },

  changeState: function () {
    this.setState({
      thread: ThreadStore.getThread(this.props.id)
    });
  },

  renderMessage: function(message) {
    return (<div className="row">
              <div>{message.timestamp}</div>
              <div>{message.sender}</div>
              <div>{message.body}</div>
            </div>);
  },

  replyToThread: function(e) {
    e.preventDefault();

    actions.replyToThread(this.state.thread, {
      message: this.state.message
    });

    this.setState({
      message: ''
    });
  },

	render: function() {
    if (_.isObject(this.state.thread)) {
      return (
        <div>
          {this.state.thread.messages.map(this.renderMessage)}
          <div className="row reply">
            <form onSubmit={this.replyToThread}>
              <textarea valueLink={this.linkState('message')} className="form-control"></textarea>
              <button type="SUBMIT" className="btn">Reply</button>
            </form>
          </div>
        </div>
      );
    }
    return (<div>Loading</div>);
	}
});
	
module.exports = Thread;
