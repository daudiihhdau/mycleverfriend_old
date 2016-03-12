//todo: logging

async = require('async');
_ = require('underscore');
var lokijs = require('lokijs');
var MissionFactory = require('./missionFactory.js')

function load(filePath, callback)
{
    var missionFactory = MissionFactory.create({
        'db': new lokijs('MyCleverFriend'),
        'filePath': filePath
    });

    missionFactory.createMission(callback);
}

module.exports = {
    load: load
}