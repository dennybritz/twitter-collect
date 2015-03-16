'use strict';

require('dotenv').load();
var twitterClient = require('./lib/twitter');
var log = require('blikk-logjs')();

if(!process.env.TWITTER_TRACK){
  log.error('You must set the TWITTER_TRACK environment variable. ' + 
    'See https://dev.twitter.com/streaming/reference/post/statuses/filter for more details.');
  process.exit(1);
}

require('./lib/twitterStream')('statuses/filter', { track: process.env.TWITTER_TRACK, language: 'en'}).startStream();