var debug = require('debug')('buzz-web:app');

var express = require('express'),
    path = require('path'),
    argv = require('yargs').argv,
    fs = require('fs'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    bluebird = require('bluebird');

var app = module.exports = express(),
    root = path.resolve(`${__dirname}/../`),
    env = argv.env || process.env.NODE_ENV || 'development',
    config = require('./config');
    utils = require('./utils');

app.set('env', env);
app.set('root', root);
app.set('config', config);
app.set('models', require('./models.js'));
app.set('redis', require('./redis.js'));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

utils.readdirRecursiveSync(`${root}/app/controllers`).forEach(function(name) {
    app.use(require(`./controllers/${name}`));
});

if (app.get('env') == 'development') {
    app.use(function(req, res, next) {
        debug(req.url);
        next();
    })
}