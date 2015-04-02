var flux = require('flux-react');
var reqwest = require("reqwest");
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

    if (!_.isFunction(factory)) {
      factory = function() {
        return new Promise(function(resolve, reject) {
          resolve(args);
        });
      };
    }

    factory.apply({}, args).then(function() {
      args = ['trigger'].concat(args);
      fn.emit.apply(fn, args);
    });
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

function makeAsync(creator, fn) {
  for (var prop in EventEmitter.prototype) {
    if (EventEmitter.prototype.hasOwnProperty(prop)) {
      creator[prop] = EventEmitter.prototype[prop];
    }
  }

  creator.handlerName = fn.handlerName;
  return creator;
}

module.exports = _.extend({
  addInterest: createActionFunction('addInterest'),
  sendInterest: createActionFunction('sendInterest', function(number, message) {
    return new Promise(function(resolve, reject) {
      reqwest({
        method: 'POST',
        url: '/api/item/' + number + '/interested',
        data: { message: message },
        success: function() {
          resolve(number, message);
        },
        failure: function() {
          reject();
        }
      })
    });
  })
});
