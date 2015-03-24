'use strict';

var tweetHelper = require('../lib/tweetHelper');
var expect = require('chai').expect;
var nock = require('nock');

describe('tweetHelper', function(){

  describe('#normalizeUrl', function(){

    it('should work', function(){
      expect(tweetHelper.normalizeUrl('http://www.google.com/abc##aaa')).to.eql('http://www.google.com/abc');
      expect(tweetHelper.normalizeUrl('http://www.google.com/abc?q=4&s=3')).to.eql('http://www.google.com/abc');
    });

  });

  describe('#resolveUrl', function(){

    it('should work for multiple redirects', function(){
      nock('http://bit.ly').get('/1').reply(301, null, {'Location': 'http://bit.ly/2'});
      nock('http://bit.ly').get('/2').reply(301, null, {'Location': 'http://bit.ly/3'});
      nock('http://bit.ly').get('/3').reply(200, 'OK');

      return tweetHelper.resolveUrlAsync('http://bit.ly/1').then(function(res){
        expect(res).to.eql('http://bit.ly/3');
      });
    });

    it('should work for URLs without redirects', function(){
      nock('http://bit.ly').get('/1').reply(200, 'OK');
      return tweetHelper.resolveUrlAsync('http://bit.ly/1').then(function(res){
        expect(res).to.eql('http://bit.ly/1');
      });
    });    

  });

});