/** @jsx React.DOM */
var React = require('react');
var addons = require('react-addons');
var Store = require('./Store');
var actions = require('./actions');
var _ = require('lodash');

var ItemEditor = React.createClass({
  mixins: [addons.LinkedStateMixin],
  contextTypes: {
    router: React.PropTypes.func
  },

  getInitialState: function () {
    var newItem = {
      number: '',
      name: '',
      description: '',
      price: '0'
    };
    var existingOrNull = Store.getItem(this.props.number);
    var item = existingOrNull || newItem;
    return {
      saved: _.isObject(existingOrNull),
      number: item.number,
      name: item.name,
      description: item.description,
      price: item.price
    };
  },

  componentWillMount: function() {
    Store.addChangeListener(this.changeState);
    actions.refreshCatalog();
  },
  
  componentWillUnmount: function() {
    Store.removeChangeListener(this.changeState);
  },

  changeState: function() {
    this.setState(this.getInitialState());
  },

  save: function() {
    var self = this;
    actions.saveItem(this.state).then(function() {
      self.context.router.transitionTo('home');
    });
  },

	render: function() {
		return (
      <div>
        <h3>Edit Item</h3>

        <div>
          <label>Number</label>
          <input valueLink={this.linkState('number')} className="form-control" type="text" placeholder="" readOnly={this.state.saved}></input>
        </div>

        <div>
          <label>Name</label>
          <input valueLink={this.linkState('name')} className="form-control" type="text" placeholder=""></input>
        </div>

        <div>
          <label>Description</label>
          <textarea valueLink={this.linkState('description')} className="form-control" type="text" placeholder=""></textarea>
        </div>

        <div>
          <label>Price</label>
          <input valueLink={this.linkState('price')} className="form-control" type="text" placeholder=""></input>
        </div>

        <div>
          <button className="btn btn-dark" onClick={this.save}>Save</button>
        </div>
      </div>
		);
	}
	
});
	
module.exports = ItemEditor;
