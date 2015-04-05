var EventEmitter = require('eventemitter2').EventEmitter2 || require('eventemitter2');
var safeDeepClone = require('./safeDeepClone');
var Promise = require("promise");
var _ = require("lodash");

var createActionFunction = function(actionName, factory) {
  var fn = function() {
    var args = safeDeepClone('[Circular]', [], Array.prototype.slice.call(arguments, 0));
    if (!fn._events) {
      throw new Error('You are triggering the action: ' + fn.handlerName + ', and nobody is listening to it yet. Remember to load up the store first');
    }

    if (_.isFunction(factory)) {
      return factory.apply({}, args).then(function() {
        try {
          var newArgs = ['trigger'].concat(safeDeepClone('[Circular]', [], Array.prototype.slice.call(arguments, 0)));
          fn.emit.apply(fn, newArgs);
        }
        catch (e) {
          console.log(e);
        }
      });
    }
    else {
      fn.emit.apply(fn, ['trigger'].concat(args));
      return new Promise(function(resolve, reject) {
        resolve();
      });
    }
  };

  var emitter = new EventEmitter();

  // It is possible to listen to the function and to achieve that we
  // have to manually inherit methods from EventEmitter
  for (var prop in EventEmitter.prototype) {
    if (EventEmitter.prototype.hasOwnProperty(prop)) {
      fn[prop] = EventEmitter.prototype[prop];
    }
  }
  
  // Add handlerName
  fn.handlerName = actionName;

  return fn;
};

module.exports = createActionFunction;
