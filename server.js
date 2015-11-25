require('dotenv').load({ silent: true });

var debug = require('debug')('buzz-web:server');

// Libraries
var express = require('express');

var server = express();
var path = require('path');
var qs = require('querystring');
var async = require('async');
var bodyParser = require('body-parser');
var colors = require('colors');
var cors = require('cors');
var logger = require('morgan');
var moment = require('moment');
var request = require('request');

var config = require('./config');

server.set('port', (process.env.PORT || 3000));
server.set('x-powered-by', false);

server.use(cors());
server.use(logger('dev'));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(function(req, res, next){
    debug(req.url);
    next();
});

server.use(express.static(`${__dirname}/dist`));
server.get([
    '/',
    '/login',
    '/signup',
    '/feed',
    '/feed/all',
    '/feed/my',
    '/feed/:category',
    '/article/:id'
], function(req, res) {
    res.sendFile(`${__dirname}/dist/index.html`);
});

server.use(function(req, res, next) {
    debug(`unresolved url: [${req.method}] ${req.headers.host}${req.url}`.red);
    next();
});

server.listen(server.get('port'), function () {
    debug(`Server listening on port ${server.get('port')}`.green);
});

server.post('/auth/twitter', function(req, res) {
    var requestTokenUrl = 'https://api.twitter.com/oauth/request_token';
    var accessTokenUrl = 'https://api.twitter.com/oauth/access_token';
    var profileUrl = 'https://api.twitter.com/1.1/users/show.json?screen_name=';

    if (!req.body.oauth_token || !req.body.oauth_verifier) {
        var requestTokenOauth = {
            consumer_key: config.twitter_api_key,
            consumer_secret: config.twitter_secret,
            callback: req.body.redirectUri
        };
        request.post({ url: requestTokenUrl, oauth: requestTokenOauth }, function(err, response, body) {
            var oauthToken = qs.parse(body);

            res.send(oauthToken);
        });
    } else {
        var accessTokenOauth = {
            consumer_key: config.twitter_api_key,
            consumer_secret: config.twitter_secret,
            token: req.body.oauth_token,
            verifier: req.body.oauth_verifier
        };

        request.post({ url: accessTokenUrl, oauth: accessTokenOauth }, function(err, response, accessToken) {
            accessToken = qs.parse(accessToken);

            var profileOauth = {
                consumer_key: config.twitter_api_key,
                consumer_secret: config.twitter_secret,
                oauth_token: accessToken.oauth_token
            };

            request.get({
                url: profileUrl + accessToken.screen_name,
                oauth: profileOauth,
                json: true
            }, function(err, response, profile) {
                var data = {
                    twitter_id : profile.id,
                    twitter_username : profile.name,
                    twitter_auth_token : accessToken.oauth_token,
                    twitter_secret : accessToken.oauth_token_secret,
                    first_name : profile.name.split(' ')[0],
                    last_name : profile.name.split(' ')[1],
                    email_address : null
                };

                request({
                    method : 'post',
                    url : 'https://www.twurl.net/api/v1/users',
                    rejectUnauthorized : false,
                    form : data
                }, function(err, response) {
                    if (err) { console.log(err) }

                    res.json(response.body);
                })
            });
        });
    }
});

module.exports = server;