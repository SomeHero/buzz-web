var debug = require('debug')('jindy:models:user');

var fs = require('fs'),
    url = require('url'),
    path = require('path'),
    request = require('request'),
    md5 = require('md5'),
    uuid = require('uuid'),
    Promise = require('bluebird');

var app = require('../app'),
    config = app.get('config'),
    errors = require('../errors'),
    utils = require('../utils');

/**
 *
 */
module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define('User', {
        name : {
            type : DataTypes.STRING(64),
            allowNull : false,
            validate : { len: [4,64] }
        },
        email : {
            type : DataTypes.STRING(128),
            allowNull : false,
            unique : true,
            validate : { len: [7,128], isEmail: true }
        },
        passHash : {
            type: DataTypes.STRING(32),
            allowNull : true,
            validate : { notEmpty : true }
        }
    }, {
        paranoid : true,
        setterMethods : {
            password : function(password) {
                if (!password) {
                    this.set('passHash', undefined)
                } else if (password.length < 6) {
                    this.set('passHash', 'invalid')
                } else {
                    this.setDataValue('passHash', hashPassword(password, config.salt))
                }
            }
        },
        classMethods : {
            associate : function(models) {
            },
            authenticate : function (email, password) {
                var models = app.get('models');
                return this.findOne({ where : {
                    email : email,
                    passHash : hashPassword(password, config.salt)
                }});
            },
            register : function (input) {
                var models = app.get('models'),
                    user, profile,
                    role = utils.capitalize(input.role);

                return new Promise(function(resolve, reject) {
                    models.User
                        .create(input)
                        .then(function(entity){
                            user = entity;

                            return models.UsersName
                                .create({
                                    UserId : user.id,
                                    name : input.name
                                });
                        })
                        .then(function(entity) {
                            console.log(entity);
                            // TODO: Consider sending profile data
                            resolve({ user : user })
                        })
                        .catch(reject);
                });
            },
            hashPassword : function (password) {
                return hashPassword(password, config.salt);
            }
        },
        instanceMethods: {
            toJSON : function () {
                var result;

                result = utils.pick(this, 'id name email role gender createdAt updatedAt');
                result.avatar = !! this.AvatarId;

                return result;
            },
            getProfile : function() {
                return this[utils.capitalize(this.role)];
            },
            loadProfile : function() {
                return this['get' + utils.capitalize(this.role)]()
            },
            generateToken : function() {
                var self = this,
                    models = app.get('models'),
                    redis = app.get('redis'),
                    token = {
                        token_type : 'Bearer',
                        expires_in : config.redis.lifetime,
                        access_token : uuid.v4(),
                        refresh_token : uuid.v4()
                    };

                return new Promise(function(resolve, reject) {
                    Promise
                        .all([
                            models.RefreshToken
                                .create({
                                    UserId : self.id,
                                    access : token.access_token,
                                    refresh : token.refresh_token
                                }),
                            redis
                                .set(token.access_token, self.id)
                                .then(function(){
                                    return redis.expire(token.access_token, config.redis.lifetime)
                                })
                        ])
                        .then(function() { resolve(token); })
                        .catch(reject);
                })
            }
        }
    });

    return User;
};

function hashPassword(password, salt) {
    return md5(salt + md5(password));
}