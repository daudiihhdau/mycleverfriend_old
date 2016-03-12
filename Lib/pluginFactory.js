"use strict";

/**
 * Created by daudiihhdau on 16.12.15.
*/

var helper = require('./helper.js');
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

    function loadPluginFile(pluginJsonObj, callback) {

        // todo: lade richtiges plugin
        // todo: downloade, installiere richtiges plugin

        var pluginFile = './../Plugins/' + pluginJsonObj.name;

        if (isModuleAvailable(pluginFile)) {

            console.log('loading plugin: ' + pluginFile);

            var plugin = require(pluginFile);
            var pluginPackage = require(pluginFile + '/package.json');

            plugin.packageDefinitions = helper.convertKeysToLowerCase(plugin.packageDefinitions);
            pluginJsonObj.input = helper.convertKeysToLowerCase(pluginJsonObj.input);

            _.each(pluginJsonObj.input, function(inputDataOn, inputPackageNameOn) {
                plugin.packageDefinitions[inputPackageNameOn].input = inputDataOn;
            });

            // merge plugin and his package-json data
            var pluginDefinition = _.extend(plugin, pluginPackage);

            return callback(null, pluginDefinition);
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

        _.each(packageDefinitions, function(packageDefinitionOn, packageNameOn) {

            packageDefinitionOn.name = packageNameOn;
            packageDefinitionOn.dbCollection = db.addCollection(packageDefinitionOn.name);
            packageDefinitionOn.properties = buildPackageProperties(packageDefinitionOn.properties);

            packages[packageNameOn.toLowerCase()] = pluginPackage.create(packageDefinitionOn);

        });
        return packages;
    }

    function buildPackageProperties(propertyDefinitions) {

        var packageProperties = {};

        _.each(propertyDefinitions, function(propertyDefinitionOn, propertyNameOn) {

            propertyDefinitionOn.name = propertyNameOn;

            packageProperties[propertyNameOn.toLowerCase()] = packageProperty.create(propertyDefinitionOn);
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

            loadPluginFile(pluginJsonObj, function (err, pluginDefinition) {

                if (err) throw err;

                var pluginNode = buildPluginNode(pluginDefinition);
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