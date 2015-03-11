'use strict';

var _ = require('underscore');
var Promise = require('bluebird');
var log = require('blikk-logjs')('twitter-stream');
var twitterClient = require('./twitter');
var tweetHelper = require('./tweetHelper');
var embedly = require('./embedly');
var dataHandlers = require('./dataHandlers');

var StreamHandler = function(endpoint, options){
  // We're keeping this in memory right now, but should be in the DB eventually
  this.processedUrls = [];
  this.endpoint = endpoint;
  this.options = options;
  this.stream = null;
};

StreamHandler.prototype.startStream = function(){
  var streamHandler = this;
  twitterClient.stream(this.endpoint, this.options, function(stream){
    streamHandler.stream = stream;
    stream.on('data', streamHandler.handleTweet.bind(streamHandler));
    stream.on('err', streamHandler.handleError.bind(streamHandler));
  });
};

StreamHandler.prototype.handleTweet = function(tweet) {
  var streamHandler = this;
  Promise.try(function(){
    return tweetHelper.getUrls(tweet);
  }).filter(function(url){
    return !_.contains(streamHandler.processedUrls, url);
  }).map(function(url){
    streamHandler.processedUrls.push(url);
    return embedly.extractFromUrlAsync(url);
  }).filter(function(metadata){
    return metadata && metadata.length > 0;
  }).each(function(metadata){
    var handlerPromises = _.map(dataHandlers, function(handler){
      return Promise.try(function(){
        return handler(metadata[0]);
      });
    });
    return Promise.settle(handlerPromises);
  }).catch(function(err){
    streamHandler.handleError(err);
  });
};

StreamHandler.prototype.handleError = function(err){
  log.error(err);
  process.exit(1);
};

module.exports = function(endpoint, options){
  return new StreamHandler(endpoint, options);
};