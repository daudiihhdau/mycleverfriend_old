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
    var packages = [];

    function loadPlugin() {
        var test = resolveIsModuleAvailable(getPluginPath());
        console.log("module available " + test);

        pluginModule = require(getPluginPath());

        // create packages
        _.each(pluginModule.packageDefinitions, function(packageDefinitionOn) {
            var newPackage = pluginPackage.create(packageDefinitionOn);
            packages.push(newPackage);
        });

        // todo: lade richtiges plugin
        // todo: downloade, installiere richtiges plugin
    }

    function getPluginPath() {
        // todo: 
        return './../Plugins/IO/' + name + '/plugin.js';
    }


    function resolveIsModuleAvailable(name) {
        try {
            return require.resolve(name)
        } catch( e ) {
            return false
        }
    }

    function getPackages(direction) {

        if (!direction) throw "Missing package direction";

        var foundPackages = [];
        for (var i=0; i<packages.length; i++) {
            if (packages[i].getDirection() === direction) foundPackages.push(packages[i]);
        }
        return foundPackages;
    }

    function getPackageByName(name) {

        if (!name) throw "Missing package name";

        for (var i=0; i<packages.length; i++) {
            if (packages[i].getName() === name) return packages[i];
        }
        return null;
    }

    return {
        init: function(pluginDefinition) { //(options){
            // jQuery Methode zum Mischen der Benutzer-
            // mit den Default-Optionen
            //_opts = $.extend(_defaults, options);

            id = pluginDefinition.id;
            name = pluginDefinition.name;
            version = pluginDefinition.version;

            loadPlugin();

            // fill packages
            _.each(pluginDefinition.input, function(inputDataOn) {
                var packageOn = getPackageByName(inputDataOn.name);
                packageOn.fill(inputDataOn);
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
        getPackageByName: function(name) {
            return getPackageByName(name);
        },
        getPackages: function(direction) {
            return getPackages(direction);
        },
        start: function() {
            pluginModule.work(function(err, data) {
                console.log(data);
            });
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