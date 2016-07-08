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
var PluginFactory = require('./pluginFactory.js');

function MissionFactory()
{
    var db;
    var filePath;
    var pluginFactory;

    function loadMissionFile(callback) {

        console.log('loading mission file: '+ filePath);
        fs.readFile(filePath, 'utf8', function (err, data) {

            if (err) return callback(new Error(err));

            return callback(null, JSON.parse(data));
        });
    }

    function createPlugins(missionJsonObj, callback) {

        async.map(missionJsonObj.plugins, pluginFactory.createPlugin, function(err, pluginNodes) {

            if (err) throw err;

            return callback(null, missionJsonObj, pluginNodes);
        });
    }

    function createMission(missionJsonObj, pluginNodes, callback) {

        var missionObj = mission.create({
            'specifications': missionJsonObj.specifications,
            //'pluginLoopNode': createPluginLoopNodes(pluginModules)
            'pluginProxies': pluginNodes
        });
        return callback(null, missionObj);
    }

    return {
        init: function (options) {

            if (!options.db) throw new Error('options.db is required');
            if (!options.filePath) throw new Error('options.filePath is required');

            db = options.db;
            filePath = options.filePath;
            pluginFactory = new PluginFactory.create({ 'db': options.db });

            return this;
        },
        createMission: function (callback) {

            async.waterfall([
                loadMissionFile,
                createPlugins,
                createMission
            ], function (err, mission) {

                if (err) throw err;

                return callback(null, mission)
            });
        }
    }
}

function create(options)
{
    return new MissionFactory().init(options);
}

module.exports.create = create;