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

    /*/ prepare packages
     _.each(missionJsonObjPlugin.input, function(missionJsonObjPluginOn, packageNameOn) {

     if (true == _.has(missionJsonObjPluginOn, "data")) {
     add(packageNameOn, missionJsonObjPluginOn.data);
     }

     if (true == _.has(missionJsonObjPluginOn, "linked")) {
     console.log("LINKED");
     console.log(missionJsonObjPluginOn.linked);
     }
     });


     pluginNode.create({
     'id': pluginJsonObjOn.id,
     'name': pluginJsonObjOn.name,
     'version': pluginJsonObjOn.version,
     "parent": pluginCollection
     }, function(err, newPluginNode) {

     pluginLoopNodes.add(newPluginNode);
     });


     */

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

    function createMission(missionJsonObj, pluginModules, callback) {

        var missionObj = mission.create({
            'db': db,
            'specifications': missionJsonObj.specifications,
            'pluginLoopNode': createPluginLoopNodes(pluginModules)
        });

        return callback(null, missionObj);
    }

    function createPluginLoopNodes(pluginDefinitions) {

        var pluginLoopNodes = [];

        //todo: this should be loopt through all pluginLoopNode
        pluginLoopNodes.push(pluginLoopNode.create({ 'pluginProxies': createPluginProxies(pluginDefinitions) }));

        return pluginLoopNodes;
    }

    function createPluginProxies(pluginDefinitions) {

        var plugins = [];

        _.each(pluginDefinitions, function(pluginDefinitionOn) {

            pluginDefinitionOn.packageCollection = createPackageCollection(pluginDefinitionOn.packageDefinitions);
            pluginDefinitionOn.parent = 'test'; //todo: this should be a pluginLoopNode

            plugins.push(pluginNode.create(pluginDefinitionOn));
        });

        return plugins;
    }

    function createPackageCollection(packageDefinitions) {

        return packageCollector.create({ 'packages':  createPackages(packageDefinitions) });
    }

    function createPackages(packageDefinitions) {

        var packages = [];

        _.each(packageDefinitions, function(packageDefinitionOn) {

            packageDefinitionOn.dbCollection = db.addCollection(packageDefinitionOn.name);
            packageDefinitionOn.packageProperties = createPackageProperties(packageDefinitionOn.packageProperties);

            packages.push(pluginPackage.create(packageDefinitionOn));

        });

        return packages;
    }

    function createPackageProperties(propertyDefinitions) {

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
                function (missionJsonObj, next) {
                    // load all plugins
                    async.map(missionJsonObj.plugins, loadPlugin, function(err, plugins) {

                        if (err) throw err;

                        return next(null, missionJsonObj, plugins);
                    });
                },
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