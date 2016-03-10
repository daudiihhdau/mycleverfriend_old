"use strict";

/**
 * Created by daudiihhdau on 17.12.15.
 */
var fs = require('fs');
var path = require('path');

module.exports.packageDefinitions = [
    {
        "name": "paths",
        "direction": "In",
        "description": "Defines the directories you like to search through.",
        "properties": [
            {   "name": "path",     "type": "path", "description": "Path where you like to search the expected files." }
        ]
    },
    {
        "name": "foundFiles",
        "direction": "Out",
        "description": "Defines all found files with the expected data.",
        "properties": [
            {   "name": "filename", "type": "path", "description": "The expected result of the filesearch." }
        ]
    }
];

module.exports.work = function(packages, callback) {
    async.map(packages.get("paths"), getFiles, callback);

    function getFiles(itemOn, callback) {
        fs.readdir(itemOn.path, function (err, filePaths) {
            if (err) throw err;

            packages.add("foundFiles", { filename: filePaths });
            return callback();
        });
    }
}

