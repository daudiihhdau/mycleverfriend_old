"use strict";

/**
 * Created by daudiihhdau on 16.12.15.
 */

var fs = require('fs');
var mission = require('./mission.js');
var pluginLoopNode = require('./pluginLoopNode.js');
var pluginNode = require('./pluginNode.js');
var pluginPackage = require('./pluginPackage.js');
var packageProperty = require('./packageProperty.js');

function MissionFactory()
{
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

    return {
        init: function (options, callback) {

            if (!options.db) throw new Error('options.db is required');
            if (!options.filePath) throw new Error('options.filePath is required');

            filePath = options.filePath;

            async.waterfall([
                loadMissionFile,
                function (missionJsonObj, next) {
                    // load all plugins
                    async.map(missionJsonObj.plugins, loadPlugin, next);
                },
                function (pluginModules, next) {

                    _.each(pluginModules, function(pluginModuleOn) {

                        console.log(pluginModuleOn)

                        _.each(pluginModuleOn.packageDefinitions, function(packageDefinitionOn) {

                            var test = pluginPackage.create(packageDefinitionOn);
                            console.log("ddd" + test);

                            _.each(packageDefinitionOn.properties, function(propertyDefinitionOn) {
                                var test2 = packageProperty.create(propertyDefinitionOn);
                            });
                        });
                    });

                    // create package properties
                    _.each(packageDefinition.properties, function(propertyDefinitionOn, propertyName) {
                        properties[propertyName.toLowerCase()] = packageProperty.create(propertyDefinitionOn);
                    });


                    // todo: add packageCollection to pluginModules
                    //var packageCollection =



                    var pluginLoops = pluginLoopNode.create();

                    _.each(pluginModules, function(pluginModuleOn) {
                        pluginLoops.add(pluginNode.create(pluginModuleOn));
                    });

                    // create package properties

                    // create packages

                    // create packageCollections

                    // create pluginNode

                    // create pluginLoopNode

                    // create mission



                    /*/ create packages
                    _.each(options.packageDefinitions, function(packageDefinitionOn, packageNameOn) {
                        packages[packageNameOn.toLowerCase()] = pluginPackage.create({  'name': packageNameOn,
                            'direction': packageDefinitionOn.direction,
                            'description': packageDefinitionOn.description,
                            'dbCollection': options.dbCollection });
                    });*/
                }
                //,createMission
            ], function (err, result) {
                // result now equals 'done'
            });

            /*
              var newMission = mission.create({   'db': db,
             'specifications': missionJsonObj.specifications,
             'pluginLoopNode': pluginLoopNode
             });
            */

        }
    }
}


function create(options, callback)
{
    return new MissionFactory().init(options, callback);
}

module.exports.create = create;