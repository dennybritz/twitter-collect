'use strict';

var log = require('blikk-logjs')('embedly');
var Promise = require('bluebird');
var embedly = require('embedly');

var EMBEDLY_KEY =  process.env.EMBEDLY_KEY;

if(!EMBEDLY_KEY){
  log.error('You must set the EMBEDLY_KEY environment variable.');
  process.exit(1);
}

var EmbedlyWrapper = function(){};

EmbedlyWrapper.prototype.extractFromUrl = function(url, cb) {
  log.info({url: url}, 'Extracting metadata');
  new embedly({key: process.env.EMBEDLY_KEY, logger: log}, function(err, api){
    if(err) return cb(err);
    api.extract({url: url}, cb);
  });
};

Promise.promisifyAll(EmbedlyWrapper.prototype);

module.exports = new EmbedlyWrapper();