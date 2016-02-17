"use strict";

/**
 * Created by daudiihhdau on 16.12.15.
 */
// http://robertnyman.com/2008/10/14/javascript-how-to-get-private-privileged-public-and-static-members-properties-and-methods/
// http://robertnyman.com/2008/10/09/explaining-javascript-scope-and-closures/

var pluginPackage = require('./pluginPackage.js');

function PluginProxy()
{
    var id;
    var name;
    var version;
    var pluginModule;
    var packages = {};

    function loadPlugin(callback) {
        var test = resolveIsModuleAvailable(getPluginPath());
        console.log("module available " + test);

        pluginModule = require(getPluginPath());

        // create packages
        _.each(pluginModule.packageDefinitions, function(packageDefinitionOn) {
            packages[packageDefinitionOn.name.toLowerCase()] = pluginPackage.create(packageDefinitionOn);
        });

        callback(null);

        // todo: lade richtiges plugin
        // todo: downloade, installiere richtiges plugin
    }

    function getPluginPath() {
        // todo: 
        return './../Plugins/Web/' + name + '/plugin.js';
        //return './../Plugins/IO/' + name + '/plugin.js';
    }


    function resolveIsModuleAvailable(name) {
        try {
            return require.resolve(name)
        } catch( e ) {
            return false
        }
    }

    function getPackages(direction) {

        if (!direction) throw Error("Missing package direction");

        var foundPackages = [];
        _.each(packages, function(inputDataOn, inputPackageNameOn) {
            if (packages[inputPackageNameOn].getDirection() == direction) foundPackages.push(packages[inputPackageNameOn]);
        });
        return foundPackages;
    }

    return {
        init: function(pluginDefinition) {

            id = pluginDefinition.id;
            name = pluginDefinition.name;
            version = pluginDefinition.version;

            loadPlugin(function(err) {
                if (err) throw err;

                // fill packages
                _.each(pluginDefinition.input, function(inputDataOn, inputPackageNameOn) {
                    packages[inputPackageNameOn.toLowerCase()].addDocuments(inputDataOn);
                });
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
            return getPackages(direction);
        },
        start: function(callback) {
            pluginModule.work(callback);
            return this;
        },
        reset: function() {
            return this;
        }
    }
};

function create(pluginDefinition)
{
    return new PluginProxy().init(pluginDefinition);
}

module.exports.create = create;