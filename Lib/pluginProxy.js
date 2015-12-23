/**
 * Created by daudiihhdau on 16.12.15.
 */
// http://robertnyman.com/2008/10/14/javascript-how-to-get-private-privileged-public-and-static-members-properties-and-methods/
// http://robertnyman.com/2008/10/09/explaining-javascript-scope-and-closures/

var pluginPackage = require('./pluginPackage.js');

module.exports = function ()
{
    var id;
    var name;
    var version;
    var packages = [];

    function loadPlugin() {
        var test = resolveIsModuleAvailable(getPluginPath());
        console.log("module available " + test)

        // todo: downloade, installiere richtiges plugin
        // todo: lade richtiges plugin
    }

    function getPluginPath() {
        return './../Plugins/Web/' + name + '/plugin.js';
    }

    function createPackages(pluginDefinition, callback) {

        var feedPlugin = require('./../Plugins/Web/ReadRssFeed/plugin.js');

        _.each(feedPlugin.packageDefinitions, function(packageDefinitionOn) {
            packages.push(pluginPackage.init(packageDefinitionOn));
        });

        callback(null, packages);
    }

    function resolveIsModuleAvailable(name) {
        try {
            return require.resolve(name)
        } catch( e ) {
            return false
        }
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
            createPackages(pluginDefinition, function(err, data) {});
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
            for (i=0; i<packages.length; i++) {
                if (packages[i].getName() === name) return packages[i];
            }
            return null;
        },
        getPackages: function(direction) {
            var foundPackages = [];
            for (i=0; i<packages.length; i++) {
                if (packages[i].getDirection() === direction) foundPackages.push(packages[i]);
            }
            return foundPackages;
        },
        start: function() {
            return this;
        },
        reset: function() {
            return this;
        }
    }
}();