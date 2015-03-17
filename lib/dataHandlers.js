'use strict';

var log = require('blikk-logjs')('data-handler');

var handlers = [];

var loggingHandler = function(record){
  log.info({url: record.url, tweet_id: record.tweet.id_str}, 'Found new article');
};
handlers.push(loggingHandler);

if(process.env.CONFLUENT_KAFKA_HTTP_ENDPOINT &&
  process.env.CONFLUENT_KAFKA_TOPIC &&
  process.env.CONFLUENT_SCHEMA_ID){
  handlers.push(require('./handlers/confluent'));
}

module.exports = handlers;