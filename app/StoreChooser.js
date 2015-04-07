/** @jsx React.DOM */
var React = require('react');
var StoreStore = require('./StoreStore');
var actions = require('./actions');
var _ = require('lodash');

var StoreChooser = React.createClass({
  getInitialState: function () {
    return {
      stores: StoreStore.getStores(),
      currentStore: StoreStore.getCurrentStore()
    };
  },

  componentWillMount: function() {
    StoreStore.addChangeListener(this.changeState);
    actions.loadStores();
  },
  
  componentWillUnmount: function() {
    StoreStore.removeChangeListener(this.changeState);
  },

  changeState: function() {
    this.setState(this.getInitialState());
    actions.loadCatalog(this.state.currentStore);
    actions.loadBids(this.state.currentStore);
  },

  renderStore: function(store) {
    var openStore = function() {
      actions.openStore(store);
    };
    return (
      <div>
        <h3>{store.name}</h3>
        <p>
          Store description goes here.
        </p>
        <button className="btn" onClick={openStore}>Open</button>
      </div>
    );
  },

	render: function() {
    if (_.isObject(this.state.currentStore) && this.props.showChooser != true) {
      return (<div>{this.props.children}</div>);
    }
		return (
      <div>
        {this.state.stores.map(this.renderStore)}
      </div>
		);
	}
	
});
	
module.exports = StoreChooser;
