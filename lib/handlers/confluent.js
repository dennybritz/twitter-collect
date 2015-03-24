'use strict';

var Promise = require('bluebird');
var log = require('blikk-logjs')('data-handler-confluent');
var client = require('confluent-client');
Promise.promisifyAll(client.topics);

client.setHost(process.env.CONFLUENT_KAFKA_HTTP_ENDPOINT);
var topicName = process.env.CONFLUENT_KAFKA_TOPIC;
var valueSchemaId = process.env.CONFLUENT_SCHEMA_ID;

module.exports = function(record){
  client.topics.produceMessagesAsync(topicName, {
    value_schema_id: valueSchemaId,
    records: [{
      value: {
        url: record.url,
        tweet_id: record.tweet.id_str
      }
    }]
  }).catch(function(error){
    log.error({err: error}, 'failed to send data to Kafka');
  });
};