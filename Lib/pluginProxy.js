"use strict";

/**
 * Created by daudiihhdau on 16.12.15.
 */
// http://robertnyman.com/2008/10/14/javascript-how-to-get-private-privileged-public-and-static-members-properties-and-methods/
// http://robertnyman.com/2008/10/09/explaining-javascript-scope-and-closures/


var packageCollector = require('./packageCollector.js');

function PluginProxy()
{
    var id;
    var name;
    var version;
    var pluginModule;
    var packageCollection;

    function setupPlugin(packagesInputObj, callback) {
        var test = resolveIsModuleAvailable(getPluginPath());
        //console.log('load plugin "' + name + '" using: "' + test);

        pluginModule = require(getPluginPath());
        packageCollection = packageCollector.create(pluginModule.packageDefinitions, packagesInputObj);

        callback(null);

        // todo: lade richtiges plugin
        // todo: downloade, installiere richtiges plugin
    }

    function getPluginPath() {
        return './../Plugins/' + name;
    }


    function resolveIsModuleAvailable(name) {
        try {
            return require.resolve(name)
        } catch( e ) {
            return false
        }
    }

    return {
        init: function(missionObjPlugin) {

            id = missionObjPlugin.id;
            name = missionObjPlugin.name;
            version = missionObjPlugin.version;

            setupPlugin(missionObjPlugin.input, function(err) {
                if (err) throw err;
            });
            return this;
        },
        getId: function() {
            return id;
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

function create(missionObjPlugin)
{
    return new PluginProxy().init(missionObjPlugin);
}

module.exports.create = create;