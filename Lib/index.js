"use strict";

//todo: logging

var missionReader = require('./missionReader.js');

function load(filePath, callback)
{
    missionReader.load(filePath, callback)
}

module.exports = {
    readMissionFile: load,
    start: null
}