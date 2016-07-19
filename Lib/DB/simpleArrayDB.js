"use strict";

function SimpleArrayDB()
{
    var db = [];

    return {
        init: function () {
            return this;
        },
        create: function (pluginID, packageName) {
            if (false == (pluginID in db)) {
                db[pluginID] = [];
            }

            return db[pluginID][packageName] = [];
        },
        get: function (pluginID) {
            return db[pluginID];
        },
        add: function (pluginID, packageName, documents) {
            db[pluginID][packageName].push(documents);
        }
    }
}

function create(options)
{
    return new SimpleArrayDB().init(options);
}

module.exports.create = create;