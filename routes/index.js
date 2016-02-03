var express = require('express');
var config = require('clickberry-config');
var QueryParser = require('clickberry-query-parser').QueryParser;
var mongoDbProvider = require('clickberry-query-parser').mongoDbProvider;

var User = require('../models/user-admin');
var Bus = require('../lib/bus-service');
var bus = new Bus({
    mode: config.get('node:env'),
    address: config.get('nsqd:address'),
    port: config.get('nsqd:port')
});

var router = express.Router();

module.exports = function (passport) {
    router.get('/heartbeat', function (req, res) {
        res.send();
    });

    router.get('/',
        passport.authenticate('access-token', {session: false, assignProperty: 'payload'}),
        new QueryParser({
            paramName: 'queryData',
            maxTop: 100,
            maxSkip: 100,
            filter: {
                used: {allow: true, rename: 'storageUsed'},
                provider: {allow: true, rename: 'memberships.provider'},
                email: {allow: true, rename: 'memberships.email'},
                name: {allow: true, rename: 'memberships.name'},
                created: {allow: true}
            },
            orderBy: {
                used: {allow: true, rename: 'storageUsed'},
                provider: {allow: true, rename: 'memberships.provider'},
                email: {allow: true, rename: 'memberships.email'},
                created: {allow: true}
            }
        }, mongoDbProvider).parse,
        function (req, res, next) {
            console.log(req.queryData);
            User.find(req.queryData.query, null, {
                sort: req.queryData.sort,
                limit: req.queryData.limit || 10,
                skip: req.queryData.skip
            }, function (err, users) {
                if (err) {
                    return next(err);
                }

                var userDtos = users.map(userMap);
                res.send(userDtos);
            });
        });

    return router;
};

function userMap(user) {
    return {
        id: user._id,
        role: user.role,
        used: user.storageUsed,
        created: user.created,
        memberships: user.memberships.map(membershipMap)
    };
}

function membershipMap(membership) {
    return {
        id: membership.id,
        provider: membership.provider,
        token: membership.token,
        email: membership.email,
        name: membership.name
    };
}