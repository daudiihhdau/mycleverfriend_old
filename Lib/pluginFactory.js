"use strict";

/**
 * Created by daudiihhdau on 16.12.15.
*/

var pluginNode = require('./pluginNode.js');
var pluginPackage = require('./pluginPackage.js');
var packageProperty = require('./packageProperty.js');
var packageCollector = require('./packageCollector.js');

function PluginFactory()
{
    var db;

    function isModuleAvailable(name) {
        try {
            return require.resolve(name)
        } catch( e ) {
            return false
        }
    }

    function loadPluginFile(pluginName, callback) {

        // todo: lade richtiges plugin
        // todo: downloade, installiere richtiges plugin

        var pluginFile = './../Plugins/' + pluginName;

        if (isModuleAvailable(pluginFile)) {

            console.log('loading plugin: ' + pluginFile);
            return callback(null, _.extend(require(pluginFile), require(pluginFile + '/package.json')));
        }
    }

    function buildPluginNode(pluginDefinition) {

        pluginDefinition.packageCollection = buildPackageCollection(pluginDefinition.packageDefinitions);
        pluginDefinition.parent = 'test'; //todo: this should be a pluginLoopNode

        return pluginNode.create(pluginDefinition);
    }

    function buildPackageCollection(packageDefinitions) {

        return packageCollector.create({ 'packages':  buildPackages(packageDefinitions) });
    }

    function buildPackages(packageDefinitions) {

        var packages = {};

        _.each(packageDefinitions, function(packageDefinitionOn) {

            packageDefinitionOn.dbCollection = db.addCollection(packageDefinitionOn.name);
            packageDefinitionOn.packageProperties = buildPackageProperties(packageDefinitionOn.properties);

            packages[packageDefinitionOn.name.toLowerCase()] = pluginPackage.create(packageDefinitionOn);

        });
        return packages;
    }

    function buildPackageProperties(propertyDefinitions) {

        var packageProperties = {};

        _.each(propertyDefinitions, function(propertyDefinitionOn) {
            packageProperties[propertyDefinitionOn.name.toLowerCase()] = packageProperty.create(propertyDefinitionOn);
        });
        return packageProperties;
    }

    return {
        init: function (options) {

            if (!options.db) throw new Error('options.db is required');

            db = options.db;

            return this;
        },
        createPlugin: function (pluginJsonObj, callback) {

            loadPluginFile(pluginJsonObj.name, function (err, pluginDefinition) {

                if (err) throw err;

                var pluginNode = buildPluginNode(pluginDefinition);

                //todo: fill with data
                _.each(pluginJsonObj.input, function(inputDataOn, inputPackageNameOn) {
                    pluginNode.getPackages().add(inputPackageNameOn, inputDataOn.data);
                });


                return callback(null, pluginNode);
            });
        }
    }
}


function create(options)
{
    return new PluginFactory().init(options);
}

module.exports.create = create;