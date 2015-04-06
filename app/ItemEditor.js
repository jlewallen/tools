/** @jsx React.DOM */
var React = require('react');
var addons = require('react-addons');
var CatalogStore = require('./CatalogStore');
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
      price: '0',
      public: false
    };
    var existingOrNull = CatalogStore.getItem(this.props.number);
    var item = existingOrNull || newItem;
    return {
      saved: _.isObject(existingOrNull),
      number: item.number,
      name: item.name,
      description: item.description,
      price: item.price,
      item: item
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

  save: function() {
    var self = this;
    actions.saveItem(this.state).then(function() {
      self.context.router.transitionTo('home');
    });
  },

  markAsPublic: function() {
    actions.markAsPublic(this.state.item);
  },

  markAsPrivate: function() {
    actions.markAsPrivate(this.state.item);
  },

  renderButtons: function() {
    var buttons = [];
    buttons.push(<button className="btn btn-dark" onClick={this.save}>Save</button>);
    if (this.state.saved) {
      if (this.state.item.public) {
        buttons.push((<button className="btn btn-sm" onClick={this.markAsPrivate}>Private</button>));
      }
      else {
        buttons.push((<button className="btn btn-sm" onClick={this.markAsPublic}>Public</button>));
      }
    }
    return buttons;
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
          {this.renderButtons()}
        </div>
      </div>
		);
	}
	
});
	
module.exports = ItemEditor;
