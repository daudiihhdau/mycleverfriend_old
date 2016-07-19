"use strict";

function SimpleArrayDB()
{
    var db = {};

    return {
        init: function () {
            return this;
        },
        get: function (packageName) {
            return db[packageName];
        },
        add: function (packageName, document) {
            db[packageName].push(document);
        }
    }
}

function create(options)
{
    return new SimpleArrayDB().init(options);
}

module.exports.create = create;