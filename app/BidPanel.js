/** @jsx React.DOM */
var React = require('react');
var addons = require('react-addons');
var Thread = require("./Thread.js");
var Store = require('./Store.js');
var BidStore = require('./BidStore.js');
var actions = require('./actions.js');
var _ = require('lodash');

var BidPanel = React.createClass({
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

  addBid: function() {
    actions.addBid(this.props.number);
  },

  bidOnItem: function(ev) {
    ev.preventDefault();
    actions.bidOnItem(this.state.item, this.state.message);
  },

  renderMyBid: function(bid) {
    return (<Thread id={bid.thread.id} openReply={true} />);
  },

	render: function() {
    if (this.state.item.youAreInterested) {
      return (<div>
                <p>You are interested.</p>
                {this.state.item.yourBids.map(this.renderMyBid)}
              </div>);
    }
    if (this.state.item.sold) {
      return (<div>
                <p>This item has been sold.</p>
              </div>);
    }
    if (_.isObject(this.state.item.pendingBid)) {
      return (
        <form onSubmit={this.bidOnItem}>
          <textarea valueLink={this.linkState('message')} className="form-control"></textarea>
          <button type="SUBMIT" className="btn">Send</button>
        </form>
      );
    }
    return (
      <button onClick={this.addBid} className="btn">Want</button>
    );
	}
	
});
	
module.exports = BidPanel;
