/** @jsx React.DOM */
var React = require('react');
var addons = require('react-addons');
var Thread = require('./Thread');
var CatalogStore = require('./CatalogStore');
var BidStore = require('./BidStore');
var actions = require('./actions');
var _ = require('lodash');

var BidPanel = React.createClass({
  mixins: [addons.LinkedStateMixin],

  getInitialState: function() {
    var item = CatalogStore.getItem(this.props.number);
    return {
      item: item,
      showBids: false
    };
  },

  componentWillMount: function() {
    CatalogStore.addChangeListener(this.changeState);
  },
  
  componentWillUnmount: function() {
    CatalogStore.removeChangeListener(this.changeState);
  },
  
  changeState: function() {
    this.setState(this.getInitialState());
  },

  addBid: function() {
    actions.addBid(this.props.number);
  },

  bidOnItem: function(ev) {
    ev.preventDefault();
    actions.bidOnItem(this.state.item, this.state.message);
  },

  showConversation: function() {
    this.setState({
      showBids: true
    });
  },

  renderMyBid: function(bid) {
    if (bid.closed && this.state.showBids === false) {
      return (
        <button className="btn btn-small btn-success" onClick={this.showConversation}>Show Conversation</button>
      );
    }
    return (<Thread key={bid.id} id={bid.thread.id} openReply={true} />);
  },

	render: function() {
    if (this.state.item.youAreInterested) {
      return (<div>
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
          <button type="SUBMIT" className="btn btn-small">Send</button>
        </form>
      );
    }
    return (
      <button onClick={this.addBid} className="btn">Want</button>
    );
	}
	
});
	
module.exports = BidPanel;
