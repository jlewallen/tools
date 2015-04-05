/** @jsx React.DOM */
var React = require('react');
var BidStore = require('./BidStore.js');
var ThreadStore = require('./ThreadStore.js');
var Store = require('./Store.js');
var Thread = require('./Thread.js');
var actions = require('./actions.js');

var Negotiation = React.createClass({
  getInitialState: function () {
    return {
      item: Store.getItem(this.props.bid.item.number)
    };
  },

  componentWillMount: function () {
    Store.addChangeListener(this.changeState);
  },

  componentWillUnmount: function () {
    Store.removeChangeListener(this.changeState);
  },

  changeState: function () {
    this.setState(this.getInitialState());
  },

  markAsPublic: function() {
    actions.markAsPublic(this.state.item);
  },

  markAsPrivate: function() {
    actions.markAsPrivate(this.state.item);
  },

  cancelBid: function() {
    actions.cancelBid(this.props.bid);
  },

  markAsPaid: function() {
    actions.markAsPaid(this.props.bid);
  },

  markAsSold: function() {
    actions.markAsSold(this.props.bid);
  },

  markAsReturned: function() {
    actions.markAsReturned(this.props.bid);
  },

  markAsShipped: function() {
    actions.markAsShipped(this.props.bid);
  },

  acknowledge: function() {
    actions.acknowledge(this.props.bid);
  },

  closeBid: function() {
    actions.closeBid(this.props.bid);
  },

  render: function() {
    var buttons = [];
    if (!this.props.bid.acknowledged) {
      buttons.push((<button className="btn" onClick={this.acknowledge}>Acknowledge</button>));
    }
    if (this.props.bid.winning) {
      if (this.props.bid.shipped) {
      }
      else {
        buttons.push((<button className="btn" onClick={this.markAsShipped}>Shipped</button>));
      }
      buttons.push((<button className="btn" onClick={this.cancelBid}>Cancel</button>));
    }
    else {
      buttons.push((<button className="btn" onClick={this.markAsSold}>Sold</button>));
    }
    if (this.props.bid.shipped) {
      if (this.props.bid.paid) {
      }
      else {
        buttons.push((<button className="btn" onClick={this.markAsPaid}>Paid</button>));
      }
      buttons.push((<button className="btn" onClick={this.markAsReturned}>Returned</button>));
    }
    if (this.state.item.public) {
      buttons.push((<button className="btn btn-sm" onClick={this.markAsPrivate}>Private</button>));
    }
    else {
      buttons.push((<button className="btn btn-sm" onClick={this.markAsPublic}>Public</button>));
    }
    buttons.push((<button className="btn btn-sm" onClick={this.closeBid}>Close</button>));
    return (
  <div>
    <Thread id={this.props.bid.thread.id} openReply={this.props.openReply} />
    <div className="row">
      <div className="col xs-12">
        {buttons}
      </div>
    </div>
  </div>
    );
}
});
	
module.exports = Negotiation;
