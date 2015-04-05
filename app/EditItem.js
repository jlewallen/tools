/** @jsx React.DOM */
var React = require('react');
var ItemEditor = require("./ItemEditor");

var EditItem = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },

  getInitialState: function () {
    return {
    };
  },

	render: function() {
		return (
      <div>
        <ItemEditor number={this.context.router.getCurrentParams().number} />
      </div>
		);
	}
	
});
	
module.exports = EditItem;
