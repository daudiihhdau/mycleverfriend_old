"use strict";

var JSONPath = require('JSONPath');

function SimpleMemoryDB()
{
    var db = [];

    return {
        init: function () {
            return this;
        },
        createPackage: function (pluginID, packageName) {
            if (false == (pluginID in db)) {
                db[pluginID] = {};
            }
            return db[pluginID][packageName] = [];
        },
        getPackage: function (pluginID, packageName) {
            return db[pluginID][packageName];
        },
        getPackages: function (pluginID) {
            return db[pluginID];
        },
        queryPackage: function (pluginID, packageName, jqueryPath) {
            return JSONPath({json: db[pluginID][packageName], path: jqueryPath });
        },
        addDocument: function (pluginID, packageName, document) {
            db[pluginID][packageName].push(document);
        },
        getAll: function () {
            return db;
        }
    }
}

function create(options)
{
    return new SimpleMemoryDB().init(options);
}

module.exports.create = create;