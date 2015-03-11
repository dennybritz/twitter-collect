'use strict';

var Promise = require('bluebird');
var log = require('blikk-logjs')('data-handler');
var slackNotifier = require('blikk-slack-notifier-js');

Promise.promisifyAll(slackNotifier);

var handlers = [];

var loggingHandler = function(metadata){
  log.info({title: metadata.title}, 'Found new article');
};
handlers.push(loggingHandler);

if(process.env.SLACK_WEBHOOK_URI){
  slackNotifier.init(process.env.SLACK_WEBHOOK_URI);
  handlers.push(function(metadata){
    slackNotifier.postToSlackAsync({
      fallback: 'Found new content at ' + metadata.url,
      username: 'Twitter Article Discovery',
      text: 'Found new content at <' + metadata.url +'>',
      icon_emoji: ':page_facing_up:',
      attachments: [{
        title: metadata.title,
        title_link: metadata.url,
        text: metadata.description
      }]
    }).catch(function(err){
      log.error({err: err}, 'Posting to Slack failed');
    });
  });
}

module.exports = handlers;