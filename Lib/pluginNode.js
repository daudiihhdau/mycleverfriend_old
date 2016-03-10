"use strict";

var packageCollector = require('./packageCollector.js');

/**
 * Created by daudiihhdau on 16.12.15.
 */
// http://robertnyman.com/2008/10/14/javascript-how-to-get-private-privileged-public-and-static-members-properties-and-methods/
// http://robertnyman.com/2008/10/09/explaining-javascript-scope-and-closures/

// = plugin proxy
function PluginNode()
{
    var id;
    var parent;
    var name;
    var description;
    var author;
    var license;
    var version;
    var pluginModule;
    var packageCollection;

    return {
        init: function(options) {

            // todo: check is number? (test: "is not existing" gives wrong answers using pluginId = 0)
            if (id in options) throw new Error('options.id is required');
            if (!options.name) throw new Error('options.name is required');
            if (!options.description) throw new Error('options.description is required');
            if (!options.author) throw new Error('options.author is required');
            if (!options.license) throw new Error('options.license is required');
            if (!options.version) throw new Error('options.version is required');
            if (!options.parent) throw new Error('options.parent is required');
            if (!options.packageCollection) throw new Error('options.packageCollection is required');

            id = options.id;
            name = options.name;
            description = options.description;
            author = options.author;
            license = options.license;
            version = options.version;
            parent = options.parent;
            packageCollection = options.packageCollection;

            return this;
        },
        getId: function() {
            return id;
        },
        getParent: function() {
            return parent;
        },
        getName: function() {
            return name;
        },
        getVersion: function() {
            return version;
        },
        getPath: function() {
            return getPluginPath();
        },
        getPackages: function(direction) {
            return packageCollection.getByDirection(direction);
        },
        start: function(callback) {
            pluginModule.work(packageCollection, callback);
            return this;
        },
        reset: function() {
            return this;
        }
    }
};

function create(options, callback)
{
    return new PluginNode().init(options);
}

module.exports.create = create;