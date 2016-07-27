"use strict";

var DBProxy = require('./dbProxy.js');

//https://blog.risingstack.com/fundamental-node-js-design-patterns/
//https://blog.risingstack.com/dependency-injection-in-node-js/
function Mission()
{
    var specifications;
    var pluginNodes;

    function startPlugin(pluginNode, packages, callback) {
        pluginNode.start(packages, function (err) {
            if (err) return callback(new Error(err));

            return callback(err, pluginNode, packages)
        })
    }

    return {
        init: function (options) {
            if (!options.specifications) throw new Error('options.specifications is required');
            if (!options.pluginProxies) throw new Error('options.pluginNodes is required');

            specifications = options.specifications;
            pluginNodes = options.pluginProxies;

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
        start : function (options, callback) {
            if (!options.db) throw new Error('options.db is required');

            var dbProxy = new DBProxy.create({ 'db': options.db });

            console.log("starting mission.");

            async.eachSeries(pluginNodes, function (pluginNodeOn, callback) {
                console.log("starting plugin (" + pluginNodeOn.getId() + "): "+ pluginNodeOn.getName());

                async.waterfall([
                    function(callback) { return callback(null, pluginNodeOn) },
                    dbProxy.createPackages,
                    dbProxy.preparePackages,
                    dbProxy.getPackages,
                    startPlugin,
                    dbProxy.savePackages,
                ], function (err) { if (err) throw err; return callback(null) });

            }, function (err) {
                if (err) { throw err; }
                console.log('Well done :-)');
                callback(null, dbProxy.getData());
            });
        }
    }
}

function create(options) {
    return new Mission().init(options);
}

module.exports.create = create;