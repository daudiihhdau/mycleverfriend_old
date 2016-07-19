"use strict";

//https://blog.risingstack.com/fundamental-node-js-design-patterns/
//https://blog.risingstack.com/dependency-injection-in-node-js/
function Mission()
{
    var specifications;
    var pluginNodes;

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
        start : function (dbProxy, callback) {
            if (!options.dbProxy) throw new Error('options.dbProxy is required');

            console.log("Trying to start the mission.");

            _.each(pluginNodes, function(pluginNodeOn) {

                async.waterfall([
                    function(callback) { return callback(null, pluginNodeOn) },
                    dbProxy.prepareData,
                    startPlugin,
                    dbProxy.saveData,
                ], function (err) { if (err) throw err; return callback(null, dataSet) });
            });
        }
    }
}

function create(options) {
    return new Mission().init(options);
}

module.exports.create = create;