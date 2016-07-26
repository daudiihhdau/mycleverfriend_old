"use strict";

/**
 * Created by daudiihhdau on 17.12.15.
 */
var fs = require('fs');
var path = require('path');

module.exports.packageTypes = {
    input: {
        paths: {
            description: "Defines the directories you like to search through.",
            properties: {
                path: {type: "path", description: "Path where you like to search the expected files."}
            }
        }
    },
    output: {
        foundfiles: {
            description: "Defines all found files with the expected data.",
            properties: {
                filename: { type: "path", description: "The expected result of the filesearch." }
            }
        }
    }
};

module.exports.work = function(packages, callback) {

    async.map(packages.input['paths'], getFiles, callback);

    function getFiles(itemOn, callback) {
        fs.readdir(itemOn.path, function (err, filePaths) {
            if (err) throw err;

            _.each(filePaths, function (filePathOn) {
                packages.output['foundfiles'].push({ 'filename': filePathOn });
            });

            return callback(err, packages);
        });
    }
}

