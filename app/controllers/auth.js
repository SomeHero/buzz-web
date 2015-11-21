var debug = require('debug')('buzz-web:controllers:authentication');

var router  = require('express').Router(),
    Sequelize = require('sequelize'),
    Promise = require('bluebird'),
    request = Promise.promisify(require('request'));

var authenticate = require('../middleware/auth'),
    errors = require('../errors');
utils = require('../utils');

/**
 *
 */
router.post('/login', function(req, res, next) {
    debug('POST /login');

    var models = res.app.get('models'),
        data = utils.pick(req.body, 'email password'),
        user, profile;

    models.User
        .authenticate(data.email, data.password)
        .then(function(entity) {
            if (!entity) {
                throw new errors.NotAllowedError('wrong_credentials');
            }
            user = entity;
            profile = user.getProfile();

            return user.generateToken();
        })
        .then(function(token){
            res.status(200).json({
                token : token,
                user : user.toJSON()
            });
        })
        .catch(next)
});

/**
 *
 */
router.post('/register', function(req, res, next) {
    debug('POST /register');

    var models = res.app.get('models'),
        input = utils.pick(req.body, 'name email role password'),
        user, profile;

    if (!input.password || input.password.length < 6) {
        throw errors.InvalidInputError('short_password');
    }

    models.User
        .register(input)
        .then(function(result) {
            user = result.user;
            profile = result.profile;

            return user.generateToken()
        })
        .then(function(token){
            res.status(201).json({
                token : token,
                user : user.toJSON()
            })
        })
        .catch(next)
});

/**
 *
 */
router.post('/oauth/:provider', function(req, res, next) {
    debug(`GET /oauth/${req.params.provider}`);

    var app = res.app,
        models = app.get('models'),
        providerName = req.params.provider, provider,
        input = req.body,
        token, user, profile;

    if (!input.code && !input.token) {
        throw errors.InvalidInputError('code_or_token_required');
    }

    if (! ~ ['google', 'facebook'].indexOf(providerName)) {
        throw errors.InvalidInputError('unsupported_oauth_provider');
    }

    provider = app.get('services')[providerName];

    (input.token
        ? Promise.resolve(input.token)
        : provider.retrieveAccessToken(input.code))
        .then(function(result) {
            return provider.getProfileInfo(token = result);
        })
        .then(function(result) {
            profile = result;

            return models.User.find({ where : { email : profile.email }});
        })
        .then(function(user) {
            if (user) {
                return Promise.resolve({ user });
            }
            return models.User.register({
                name : profile.name,
                email : profile.email,
                passHash : null
            });
        })
        .then(function(result) {
            return (user = result.user).generateToken();
        })
        .then(function(token) {
            res.json({
                token : token,
                user : user.toJSON()
            });

            if (!user.avatar && profile.avatar) {
                user.uploadAvatar(profile.avatar);
            }
        })
        .catch(next);
});

/**
 *
 */
router.get('/logout', authenticate(), function(req, res, next) {
    debug('GET /logout');

    var models = res.app.get('models'),
        redis = res.app.get('redis'),
        token = res.locals.accessToken;

    models.RefreshToken
        .destroy({ where : { access : token } })
        .then(function() {
            return redis.del(token)
        })
        .then(function() {
            res.status(200).json({ status : 'ok' });
        })
        .catch(next)
});

/**
 *
 */
router.post('/refresh-token', function(req, res, next) {
    debug('POST /refresh-token');

    var models = res.app.get('models');

    models.RefreshToken
        .findOne({ where : { refresh : req.body.refresh_token } })
        .then(function(token) {
            if (!token) {
                throw errors.NotFoundError('invalid_refresh_token');
            }

            return token.regenerate();
        })
        .then(function(token) {
            res.json({ token : token });
        })
        .catch(next)
});

module.exports = router;