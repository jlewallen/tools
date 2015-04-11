/** @jsx React.DOM */
var React = require('react');
var Router = require('react-router');
var App = require('./App');
var StoreChooser = require('./StoreChooser');
var AdminApp = require('./AdminApp');
var NewItem = require('./NewItem');
var EditItem = require('./EditItem');
var Logout = require('./Logout');

var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

var Layout = React.createClass({
  render: function() {
    return (
      <div className="container">
        <header>
          <ul className="row">
            <li><Link to="home">Home</Link></li>
            <li><Link to="stores">Stores</Link></li>
            <li><Link to="admin">Admin</Link></li>
            <li><Link to="new-item">New Item</Link></li>
            <li><Link to="logout">Logout</Link></li>
          </ul>
        </header>
        <RouteHandler/>
      </div>
    );
  }
});

var ChooseStore = React.createClass({
  render: function() {
    return (
      <StoreChooser showChooser={true} />
    );
  }
});

var routes = (
  <Route name="app" path="/" handler={Layout}>
    <Route name="home" handler={App}/>
    <Route name="stores" handler={ChooseStore}/>
    <Route name="admin" handler={AdminApp}/>
    <Route name="new-item" handler={NewItem}/>
    <Route name="edit-item" path="/items/:number" handler={EditItem}/>
    <Route name="logout" handler={Logout}/>
    <DefaultRoute handler={App}/>
  </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.body);
});
