"use strict";

var pluginNode = require('./pluginNode.js');
var pluginPackage = require('./pluginPackage.js');
var packageProperty = require('./packageProperty.js');
var helper = require('./helper.js');

function PluginFactory()
{
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

        var pluginDirectory = './../Plugins/' + pluginJsonObj.name;

        if (false == isModuleAvailable(pluginDirectory)) {
            return callback(new Error('Plugin is not available'));
        }

        console.log('loading plugin: ' + pluginDirectory);

        var plugin = require(pluginDirectory);
        var pluginPackage = require(pluginDirectory + '/package.json');

        plugin.packageTypes = helper.convertKeysToLowerCase(plugin.packageTypes);
        plugin.packageTypes.input = helper.convertKeysToLowerCase(plugin.packageTypes.input);
        plugin.packageTypes.output = helper.convertKeysToLowerCase(plugin.packageTypes.output);
        pluginJsonObj.input = helper.convertKeysToLowerCase(pluginJsonObj.input);

        // save the key of the packageDefinition as "name"-value
        _.each(['input', 'output'], function(directionOn) {
            _.each(plugin.packageTypes[directionOn], function(packageOn, packageNameOn) {
                packageOn.name = packageNameOn;
            });
        });

        // save all input values of the mission file
        _.each(pluginJsonObj.input, function(inputDataOn, inputPackageNameOn) {
            plugin.packageTypes.input[inputPackageNameOn].input = inputDataOn;
        });

        // merge plugin and his package-json data
        var pluginDefinition = _.extend(plugin, pluginPackage);
        pluginDefinition.id = pluginJsonObj.id;
        pluginDefinition.packages = {
            input: {},
            output: {}
        };

        return callback(null, pluginDefinition);
    }

    function createInputPackages(pluginDefinition, callback) {
        createPackages(pluginDefinition.packageTypes['input'], function(err, packages) {
            if (err) throw err;

            pluginDefinition.packages.input = packages;
            return callback(null, pluginDefinition);
        });
    }

    function createOutputPackages(pluginDefinition, callback) {
        createPackages(pluginDefinition.packageTypes['output'], function(err, packages) {
            if (err) throw err;

            pluginDefinition.packages.output = packages;
            return callback(null, pluginDefinition);
        });
    }

    function createPackages(packageTypes, callback) {

        async.map(packageTypes, function (packageTypeOn, callback) {

            async.waterfall([
                function(cb) { return cb(null, packageTypeOn) },
                buildPackageProperties,
                buildPackage
            ], function (err, packageObj) {

                if (err) throw err;

                return callback(null, packageObj)
            });
        }, function (err, packages) {
            if (err) throw err;

            var packagesList = {};
            _.each(packages, function(packageOn) {
                packagesList[packageOn.getName().toLowerCase()] = packageOn;
            });

            return callback(null, packagesList);
        });
    }

    function buildPackageProperties(packageDefinitionOn, callback) {

        var packageProperties = {};

        _.each(packageDefinitionOn.properties, function(propertyDefinitionOn, propertyNameOn) {
            // save the property key name as value
            propertyDefinitionOn.name = propertyNameOn;
            packageProperties[propertyNameOn.toLowerCase()] = packageProperty.create(propertyDefinitionOn);
        });

        packageDefinitionOn.properties = packageProperties;

        return callback(null, packageDefinitionOn);
    }

    function buildPackage(packageDefinitionOn, callback) {

        return callback(null, pluginPackage.create(packageDefinitionOn));
    }

    function createPlugin(pluginDefinition, callback) {
        
        pluginDefinition.parent = 'test'; //todo: this should be a pluginLoopNode

        return callback(null, pluginNode.create(pluginDefinition));
    }

    return {
        init: function (options) {
            return this;
        },
        createPlugin: function (pluginJsonObj, callback) {

            async.waterfall([
                function(cb) { return cb(null, pluginJsonObj) },
                loadPluginFile,
                createInputPackages,
                createOutputPackages,
                createPlugin
            ], function (err, plugin) {

                if (err) throw err;

                return callback(null, plugin)
            });
        }
    }
}

function create(options)
{
    return new PluginFactory().init(options);
}

module.exports.create = create;