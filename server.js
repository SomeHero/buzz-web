require('dotenv').load({ silent: true });

var debug = require('debug')('buzz-web:server');

// Libraries
var express = require('express');
//var application = require('./app/app.js');

var server = express();

server.set('port', (process.env.PORT || 3000));
server.set('x-powered-by', false);
//server.use('/api', application);

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
    '/news/:category',
    '/news/:id'
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

module.exports = server;