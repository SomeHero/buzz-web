var debug = require('debug')('buzz-web:middleware:authenticate');

var Promise = require('bluebird');

var errors = require('../errors'),
    utils = require('../utils');

module.exports = function authenticateMiddlewareGenerator(options) {
    options = utils.extend({
        restrict : null,    //  restriction by user role
        include : null      //  loading user's profile, location, etc..
    }, options);

    if (options.restrict !== null && !Array.isArray(options.restrict)) {
        options.restrict = [ options.restrict ];
    }

    if (!Array.isArray(options.include)) {
        options.include = [ options.include ];
    }

    return function authenticate(req, res, next) {
        debug('auth started');

        var models = res.app.get('models'),
            redis = res.app.get('redis'),
            config = res.app.get('config'),
            token, user;

        if ((!("token" in req.query)) && (!("authentication" in req.headers))) {
            throw errors.NotAllowedError('no_token_provided');
        }

        res.locals.accessToken = token = req.query.token || req.headers.authentication;
        debug(`token: ${token}`);

        redis
            .get(token)
            .then(function (id) {
                var include = [];

                if (options.include && (~ options.include.indexOf('Location'))) {
                    include.push({ model : models.Location, as : 'Location' })
                }

                return models.User.findById(id, { include : include });
            })
            .then(function(entity) {
                if (!entity) {
                    throw errors.InvalidToken('token_not_valid');
                }

                if ( options.restrict && (!~options.restrict.indexOf(entity.role)) ) {
                    throw errors.NotAllowedError(`denied_for_${entity.role}`);
                }

                user = res.locals.user = entity;
                debug(`auth success for ${user.name}`);

                if (~ ['admin', 'moderator'].indexOf(user.role)) {
                    return Promise.resolve();
                }

                return (options.include && (~options.include.indexOf('Profile')))
                    ? models[utils.capitalize(user.role)]
                    .find({ where: { UserId: user.id } })
                    : Promise.resolve();
            })
            .then(function(profile) {
                if (profile) {
                    res.locals.profile = profile;
                }

                next();
            })
            .catch(function(err) {
                debug(err);
                next(err);
            });
    }
};