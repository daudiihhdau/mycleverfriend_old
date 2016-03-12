"use strict";

/**
 * Created by daudiihhdau on 16.12.15.

 // create package properties

 // create packages

 // create packageCollections

 // create pluginNode

 // create pluginLoopNode

 // create mission

 */

var fs = require('fs');
var mission = require('./mission.js');
var pluginLoopNode = require('./pluginLoopNode.js');
var pluginNode = require('./pluginNode.js');
var pluginPackage = require('./pluginPackage.js');
var packageProperty = require('./packageProperty.js');
var packageCollector = require('./packageCollector.js');

function MissionFactory()
{
    var db;
    var filePath;

    function loadMissionFile(next) {

        console.log('loading mission file: '+ filePath);
        fs.readFile(filePath, 'utf8', function (err, data) {

            if (err) return next(new Error(err));

            return next(null, JSON.parse(data));
        });
    }

    function isModuleAvailable(name) {
        try {
            return require.resolve(name)
        } catch( e ) {
            return false
        }
    }

    function loadPlugin(pluginJsonObj, callback) {

        // todo: lade richtiges plugin
        // todo: downloade, installiere richtiges plugin

        var pluginFile = './../Plugins/' + pluginJsonObj.name;

        if (isModuleAvailable(pluginFile)) {

            console.log('loading plugin: ' + pluginFile);

            return callback(null, _.extend(require(pluginFile), require(pluginFile + '/package.json')));
        }
    }

    function loadPluginDefinitions(missionJsonObj, callback) {

        async.map(missionJsonObj.plugins, loadPlugin, function(err, pluginDefinitions) {

            if (err) throw err;

            return callback(null, missionJsonObj, pluginDefinitions);
        });
    }

    function createPlugins(missionJsonObj, pluginDefinitions, callback) {

        return callback(null, missionJsonObj, buildPluginNodes(pluginDefinitions));
    }

    function fillPlugins(missionJsonObj, pluginNodes, callback) {

        console.log(pluginNodes)
        console.log('###')
        console.log(missionJsonObj)

        _.each(pluginNodes, function(pluginNodeOn) {

        });

        return callback(null, missionJsonObj, pluginNodes);
    }

    function createMission(missionJsonObj, pluginNodes, callback) {

        var missionObj = mission.create({
            'specifications': missionJsonObj.specifications,
            //'pluginLoopNode': createPluginLoopNodes(pluginModules)
            'pluginProxies': pluginNodes
        });
        return callback(null, missionObj);
    }

    function buildPluginNodes(pluginDefinitions) {

        var plugins = [];

        _.each(pluginDefinitions, function(pluginDefinitionOn) {

            pluginDefinitionOn.packageCollection = buildPackageCollection(pluginDefinitionOn.packageDefinitions);
            pluginDefinitionOn.parent = 'test'; //todo: this should be a pluginLoopNode

            plugins[pluginDefinitionOn.name.toLowerCase()] = pluginNode.create(pluginDefinitionOn);
        });
        return plugins;
    }

    function buildPackageCollection(packageDefinitions) {

        return packageCollector.create({ 'packages':  buildPackages(packageDefinitions) });
    }

    function buildPackages(packageDefinitions) {

        var packages = {};

        _.each(packageDefinitions, function(packageDefinitionOn) {

            packageDefinitionOn.dbCollection = db.addCollection(packageDefinitionOn.name);
            packageDefinitionOn.packageProperties = buildPackageProperties(packageDefinitionOn.packageProperties);

            packages[packageDefinitionOn.name.toLowerCase()] = pluginPackage.create(packageDefinitionOn);

        });
        return packages;
    }

    function buildPackageProperties(propertyDefinitions) {

        var packageProperties = [];

        _.each(propertyDefinitions, function(propertyDefinitionOn) {
            packageProperties.push(packageProperty.create(propertyDefinitionOn));
        });
        return packageProperties;
    }

    return {
        init: function (options, callback) {

            if (!options.db) throw new Error('options.db is required');
            if (!options.filePath) throw new Error('options.filePath is required');

            db = options.db;
            filePath = options.filePath;

            async.waterfall([
                loadMissionFile,
                loadPluginDefinitions,
                createPlugins,
                fillPlugins,
                createMission
            ], function (err, mission) {

                if (err) throw err;

                return callback(null, mission)
            });
        }
    }
}


function create(options, callback)
{
    return new MissionFactory().init(options, callback);
}

module.exports.create = create;