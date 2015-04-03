/** @jsx React.DOM */
var React = require('react');
var Router = require('react-router');
var App = require('./App.js');
var AdminApp = require('./AdminApp.js');

var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

var Layout = React.createClass({
  render: function () {
    return (
      <div className="container">
        <header>
          <ul className="row">
            <li><Link to="home">Home</Link></li>
            <li><Link to="admin">Admin</Link></li>
          </ul>
        </header>
        <RouteHandler/>
      </div>
    );
  }
});

var routes = (
  <Route name="app" path="/" handler={Layout}>
    <Route name="home" handler={App}/>
    <Route name="admin" handler={AdminApp}/>
    <DefaultRoute handler={App}/>
  </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.body);
});
