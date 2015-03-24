'use strict';

var Promise = require('bluebird');
var request = require('superagent');
var querystring = require('querystring');
var _ = require('underscore');
var urls  = require('url');
var log = require('blikk-logjs')('TweetHelper');

var TRASH_QUERY_STRINGS = [
  'utm_source', 'utm_medium', 'utm_term', 'utm_content', 'utm_id', 'utm_campaign', 'gclid',
  'referrer'
];

var TweetHelper = function(){};

TweetHelper.prototype.getUrls = function(tweet) {
  return _.map(tweet.entities.urls, function(urlObj){
    return urlObj.expanded_url || urlObj.url;
  });
};

// Removes the hash and query string the url
TweetHelper.prototype.normalizeUrl = function(url) {
  var urlObj = urls.parse(url);
  urlObj.hash = null;
  if(urlObj.search){
    var qsObj = querystring.parse(urlObj.query);
    TRASH_QUERY_STRINGS.forEach(function(qs){
      delete qsObj[qs];
    });
    urlObj.query = querystring.stringify(qsObj);
    urlObj.search = (_.keys(qsObj).length > 0) ? ('?' + urlObj.query) : null;
  };
  return urls.format(urlObj);
};

// Issues a HEAD request and reads the resulting location header
TweetHelper.prototype.resolveUrl = function(url, callback){
  request
    .get(url)
    .end(function(err, res){
      if(err) {
        callback(err, null);
      } else if(res.redirects && res.redirects.length > 0){
        var finalUrl = _.last(res.redirects);
        log.info({originalUrl: url, resolvedUrl: finalUrl}, 'resolved url');
        callback(null, finalUrl);
      } else {
        callback(null, url);
      }
    });
};

Promise.promisifyAll(TweetHelper);
Promise.promisifyAll(TweetHelper.prototype);

module.exports = new TweetHelper();
