"use strict";

var DbProxy = require('./dbProxy.js');

//https://blog.risingstack.com/fundamental-node-js-design-patterns/
//https://blog.risingstack.com/dependency-injection-in-node-js/
function Mission()
{
    var specifications;
    var pluginNodes;
    var db;


    function createDbProxy(pluginNodeOn, callback) {
        console.log('create pluginDbProxy for plugin: ' + pluginNodeOn.getName());

        var pluginDbProxy = DbProxy.create({
            'db': db,
            'pluginNode': pluginNodeOn
        });

        return callback(null, pluginNodeOn, pluginDbProxy);
    }

    function setupDbProxy(pluginNodeOn, pluginDbProxy, callback) {
        console.log('prepare data for plugin: ' + pluginNodeOn.getName());

        pluginDbProxy.setup(function (err) {
            if (err) throw err;

            return callback(null, pluginNodeOn, pluginDbProxy);
        });
    }

    function startPlugin(pluginNodeOn, pluginDbProxy, callback) {
        console.log('start plugin: ' + pluginNodeOn.getName());

        pluginNodeOn.start(pluginDbProxy, function(err) {
            if (err) throw err;

            return callback(null);
        });
    }


    return {
        init: function (options) {
            if (!options.specifications) throw new Error('options.specifications is required');
            if (!options.pluginProxies) throw new Error('options.pluginNodes is required');
            if (!options.db) throw new Error('options.db is required');

            specifications = options.specifications;
            pluginNodes = options.pluginProxies;
            db = options.db;

            return this;
        },
        getName: function () {
            return specifications.name;
        },
        getVersion: function () {
            return specifications.version;
        },
        getAuthor: function () {
            return specifications.author;
        },
        getDescription: function () {
            return specifications.description;
        },
        getTags: function () {
            return specifications.tags;
        },
        getPlugins: function () {
            // pluginLoopNode
            return pluginNodes;
        },
        start : function (callback) {
            console.log("Trying to start the mission.");

            _.each(pluginNodes, function(pluginNodeOn) {

                async.waterfall([
                    function(callback) { return callback(null, pluginNodeOn) },
                    createDbProxy,
                    setupDbProxy,
                    startPlugin,
                ], function (err) { if (err) throw err; return callback(null) });
            });
        }
    }
}

function create(options) {
    return new Mission().init(options);
}

module.exports.create = create;