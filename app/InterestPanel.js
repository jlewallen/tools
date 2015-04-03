/** @jsx React.DOM */
var React = require('react');
var addons = require('react-addons');
var Thread = require("./Thread.js");
var Store = require('./Store.js');
var actions = require('./actions.js');
var _ = require('lodash');

var InterestPanel = React.createClass({
  mixins: [addons.LinkedStateMixin],

  getInitialState: function() {
    return {
      item: Store.getItem(this.props.number)
    };
  },

  componentWillMount: function() {
    Store.addChangeListener(this.changeState);
  },
  
  componentWillUnmount: function() {
    Store.removeChangeListener(this.changeState);
  },
  
  changeState: function() {
    this.setState({
      item: Store.getItem(this.props.number)
    });
  },

  addInterest: function() {
    actions.addInterest(this.props.number);
  },

  interested: function(ev) {
    ev.preventDefault();
    actions.interested(this.state.item, this.state.message);
  },

  renderMyInterest: function(interest) {
    return (<Thread id={interest.thread.id}/>);
  },

	render: function() {
    if (this.state.item.youAreInterested) {
      return (<div>
                <p>You are interested.</p>
                {this.state.item.yourInterests.map(this.renderMyInterest)}
              </div>);
    }
    if (this.state.item.sold) {
      return (<div>
                <p>This item has been sold.</p>
              </div>);
    }
    if (_.isObject(this.state.item.pendingInterest)) {
      return (
        <form onSubmit={this.interested}>
          <textarea valueLink={this.linkState('message')} className="form-control"></textarea>
          <button type="SUBMIT" className="btn">Send</button>
        </form>
      );
    }
    return (
      <button onClick={this.addInterest} className="btn">Want</button>
    );
	}
	
});
	
module.exports = InterestPanel;
