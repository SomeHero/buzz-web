require('dotenv').load({ silent: true });

var debug = require('debug')('buzz-web:server');

// Libraries
var express = require('express');

var server = express();
var path = require('path');
var qs = require('querystring');

var async = require('async');
var bcrypt = require('bcryptjs');
var bodyParser = require('body-parser');
var colors = require('colors');
var cors = require('cors');
var logger = require('morgan');
var jwt = require('jwt-simple');
var moment = require('moment');
var mongoose = require('mongoose');
var request = require('request');

var config = require('./app/config');


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
    debug(`unresolved url: ${req.headers.host}${req.url}`);
    next();
});

server.listen(server.get('port'), function () {
    debug(`Server listening on port ${server.get('port')}`);
    console.log(`Server listening on port ${server.get('port')}`);
});

var userSchema = new mongoose.Schema({
    email: { type: String, unique: true, lowercase: true },
    password: { type: String, select: false },
    displayName: String,
    picture: String,
    twitter: String
});

userSchema.pre('save', function(next) {
    var user = this;
    if (!user.isModified('password')) {
        return next();
    }
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(user.password, salt, function(err, hash) {
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function(password, done) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
        done(err, isMatch);
    });
};

var User = mongoose.model('User', userSchema);

console.log(config.mongo_URI);
mongoose.connect(config.mongo_URI);
mongoose.connection.on('error', function(err) {
    console.log('Error: Could not connect to MongoDB. Did you forget to run `mongod`?'.red);
});

/*
 |--------------------------------------------------------------------------
 | Login Required Middleware
 |--------------------------------------------------------------------------
 */
function ensureAuthenticated(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).send({ message: 'Please make sure your request has an Authorization header' });
    }
    var token = req.headers.authorization.split(' ')[1];

    var payload = null;
    try {
        payload = jwt.decode(token, config.TOKEN_SECRET);
    }
    catch (err) {
        return res.status(401).send({ message: err.message });
    }

    if (payload.exp <= moment().unix()) {
        return res.status(401).send({ message: 'Token has expired' });
    }
    req.user = payload.sub;
    next();
}

/*
 |--------------------------------------------------------------------------
 | Generate JSON Web Token
 |--------------------------------------------------------------------------
 */
function createJWT(user) {
    var payload = {
        sub: user._id,
        iat: moment().unix(),
        exp: moment().add(14, 'days').unix()
    };
    return jwt.encode(payload, config.TOKEN_SECRET);
}

/*
 |--------------------------------------------------------------------------
 | GET /api/me
 |--------------------------------------------------------------------------
 */
server.get('/api/me', ensureAuthenticated, function(req, res) {
    User.findById(req.user, function(err, user) {
        res.send(user);
    });
});

/*
 |--------------------------------------------------------------------------
 | PUT /api/me
 |--------------------------------------------------------------------------
 */
server.put('/api/me', ensureAuthenticated, function(req, res) {
    User.findById(req.user, function(err, user) {
        if (!user) {
            return res.status(400).send({ message: 'User not found' });
        }
        user.displayName = req.body.displayName || user.displayName;
        user.email = req.body.email || user.email;
        user.save(function(err) {
            res.status(200).end();
        });
    });
});


/*
 |--------------------------------------------------------------------------
 | Log in with Email
 |--------------------------------------------------------------------------
 */
server.post('/auth/login', function(req, res) {
    User.findOne({ email: req.body.email }, '+password', function(err, user) {
        if (!user) {
            return res.status(401).send({ message: 'Invalid email and/or password' });
        }
        user.comparePassword(req.body.password, function(err, isMatch) {
            if (!isMatch) {
                return res.status(401).send({ message: 'Invalid email and/or password' });
            }
            res.send({ token: createJWT(user) });
        });
    });
});

/*
 |--------------------------------------------------------------------------
 | Create Email and Password Account
 |--------------------------------------------------------------------------
 */
server.post('/auth/signup', function(req, res) {
    User.findOne({ email: req.body.email }, function(err, existingUser) {
        if (existingUser) {
            return res.status(409).send({ message: 'Email is already taken' });
        }
        var user = new User({
            displayName: req.body.displayName,
            email: req.body.email,
            password: req.body.password
        });
        user.save(function(err, result) {
            if (err) {
                res.status(500).send({ message: err.message });
            }
            res.send({ token: createJWT(result) });
        });
    });
});

/*
 |--------------------------------------------------------------------------
 | Login with Twitter
 |--------------------------------------------------------------------------
 */
server.post('/auth/twitter', function(req, res) {
    console.log('was here');

    var requestTokenUrl = 'https://api.twitter.com/oauth/request_token';
    var accessTokenUrl = 'https://api.twitter.com/oauth/access_token';
    var profileUrl = 'https://api.twitter.com/1.1/users/show.json?screen_name=';

    // Part 1 of 2: Initial request from Satellizer.
    console.log(req.body);
    if (!req.body.oauth_token || !req.body.oauth_verifier) {
        var requestTokenOauth = {
            consumer_key: config.twitter.client_id,
            consumer_secret: config.twitter.client_secret,
            callback: req.body.redirectUri
        };

        // Step 1. Obtain request token for the authorization popup.
        request.post({ url: requestTokenUrl, oauth: requestTokenOauth }, function(err, response, body) {
            var oauthToken = qs.parse(body);

            // Step 2. Send OAuth token back to open the authorization screen.
            res.send(oauthToken);
        });
    } else {
        // Part 2 of 2: Second request after Authorize app is clicked.
        var accessTokenOauth = {
            consumer_key: config.twitter.client_id,
            consumer_secret: config.twitter.client_secret,
            token: req.body.oauth_token,
            verifier: req.body.oauth_verifier
        };

        // Step 3. Exchange oauth token and oauth verifier for access token.
        request.post({ url: accessTokenUrl, oauth: accessTokenOauth }, function(err, response, accessToken) {

            accessToken = qs.parse(accessToken);

            var profileOauth = {
                consumer_key: config.twitter.client_id,
                consumer_secret: config.twitter.client_secret,
                oauth_token: accessToken.oauth_token
            };

            // Step 4. Retrieve profile information about the current user.
            request.get({
                url: profileUrl + accessToken.screen_name,
                oauth: profileOauth,
                json: true
            }, function(err, response, profile) {

                // Step 5a. Link user accounts.
                if (req.headers.authorization) {
                    User.findOne({ twitter: profile.id }, function(err, existingUser) {
                        if (existingUser) {
                            return res.status(409).send({ message: 'There is already a Twitter account that belongs to you' });
                        }

                        var token = req.headers.authorization.split(' ')[1];
                        var payload = jwt.decode(token, config.TOKEN_SECRET);

                        User.findById(payload.sub, function(err, user) {
                            if (!user) {
                                return res.status(400).send({ message: 'User not found' });
                            }

                            user.twitter = profile.id;
                            user.displayName = user.displayName || profile.name;
                            user.picture = user.picture || profile.profile_image_url.replace('_normal', '');
                            user.save(function(err) {
                                res.send({ token: createJWT(user) });
                            });
                        });
                    });
                } else {
                    // Step 5b. Create a new user account or return an existing one.
                    User.findOne({ twitter: profile.id }, function(err, existingUser) {
                        if (existingUser) {
                            return res.send({ token: createJWT(existingUser) });
                        }

                        var user = new User();
                        user.twitter = profile.id;
                        user.displayName = profile.name;
                        user.picture = profile.profile_image_url.replace('_normal', '');
                        user.save(function() {
                            res.send({ token: createJWT(user) });
                        });
                    });
                }
            });
        });
    }
});

/*
 |--------------------------------------------------------------------------
 | Unlink Provider
 |--------------------------------------------------------------------------
 */
server.post('/auth/unlink', ensureAuthenticated, function(req, res) {
    var provider = req.body.provider;
    var providers = ['facebook', 'foursquare', 'google', 'github', 'instagram',
        'linkedin', 'live', 'twitter', 'twitch', 'yahoo'];

    if (providers.indexOf(provider) === -1) {
        return res.status(400).send({ message: 'Unknown OAuth Provider' });
    }

    User.findById(req.user, function(err, user) {
        if (!user) {
            return res.status(400).send({ message: 'User Not Found' });
        }
        user[provider] = undefined;
        user.save(function() {
            res.status(200).end();
        });
    });
});

module.exports = server;