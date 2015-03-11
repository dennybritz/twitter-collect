'use strict';

var _ = require('underscore');

var TweetHelper = function(){};

TweetHelper.prototype.getUrls = function(tweet) {
  return _.map(tweet.entities.urls, function(urlObj){
    return urlObj.expanded_url || urlObj.url;
  });
};

module.exports = new TweetHelper();
