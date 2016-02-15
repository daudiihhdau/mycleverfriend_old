"use strict";

/**
 * Created by daudiihhdau on 17.12.15.
 */
var fs = require('fs');
var path = require('path');
var missionPlugin = require('../../../Lib/missionPlugin.js')

var pathsPackage = {
    "name": "Paths",
    "direction": "Input",
    "description": "Defines the directories you like to search through.",
    "properties":   [{ "name": "path", "type": "path", "description": "Path where you like to search the expected files." }]
};

var foundFilesPackage = {
    "name": "FoundFiles",
    "direction": "Output",
    "description": "Defines all found files with the expected data.",
    "properties":   [{ "name": "filename", "type": "path", "description": "The expected result of the filesearch." }]
};

module.exports.packageDefinitions = [pathsPackage, foundFilesPackage];


module.exports.work = function(callback) {

    async.waterfall([
        function(callback) {
            missionPlugin.getNextItem(pathsPackage, callback); },
        function(item, callback) {
            fs.readdir(item.path, callback); }
    ], callback);
}