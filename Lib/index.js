//todo: logging

async = require('async');
_ = require('underscore');
var lokijs = require('lokijs');
var missionFactory = require('./missionFactory.js')

function load(filePath, callback)
{
    missionFactory.create({ 'db': new lokijs('MyCleverFriend'),
                            'filePath': filePath
    }, callback);
}

module.exports = {
    load: load
}