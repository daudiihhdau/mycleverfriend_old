//todo: logging

async = require('async');
_ = require('underscore');
var MissionFactory = require('./missionFactory.js')

function load(filePath, callback) {
    var missionFactory = MissionFactory.create({ 'filePath': filePath });
    missionFactory.createMission(callback);
}

module.exports = {
    load: load
}