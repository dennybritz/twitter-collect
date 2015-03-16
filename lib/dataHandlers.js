'use strict';

var Promise = require('bluebird');
var log = require('blikk-logjs')('data-handler');
var slackNotifier = require('blikk-slack-notifier-js');

Promise.promisifyAll(slackNotifier);

var handlers = [];

var loggingHandler = function(url){
  log.info({url: url}, 'Found new article');
};
handlers.push(loggingHandler);

if(process.env.SLACK_WEBHOOK_URI){
  slackNotifier.init(process.env.SLACK_WEBHOOK_URI);
  handlers.push(function(url){
    slackNotifier.postToSlackAsync({
      fallback: 'Found new content at ' + url,
      username: 'Twitter Article Discovery',
      text: 'Found new content at <' + url +'>',
      icon_emoji: ':page_facing_up:'
    }).catch(function(err){
      log.error({err: err}, 'Posting to Slack failed');
    });
  });
}

module.exports = handlers;