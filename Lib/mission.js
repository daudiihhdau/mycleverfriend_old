"use strict";

/**
 * Created by daudiihhdau on 16.12.15.
 */

//https://blog.risingstack.com/fundamental-node-js-design-patterns/
//https://blog.risingstack.com/dependency-injection-in-node-js/
function Mission()
{
    var db;
    var specifications;
    var pluginLoopNode;

    return {
        init: function (options) {

            if (!options.db) {
                throw new Error('options.db is required');
            }
            if (!options.specifications) {
                throw new Error('options.specifications is required');
            }
            if (!options.pluginLoopNode) {
                throw new Error('options.pluginLoopNode is required');
            }

            db = options.db;
            specifications = options.specifications;
            pluginLoopNode = options.pluginLoopNode;

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
            return null; //pluginProxies;
        },
        start : function (callback) {

            console.log("Trying to start the mission.");

            /*_.each(pluginProxies, function(pluginProxyOn) {
                console.log('starte plugin "' + pluginProxyOn.getName() + '" using: ' + pluginProxyOn.getPath());
                pluginProxyOn.start(callback);
            });*/
        }
    }
}

function create(options)
{
    return new Mission().init(options);
}

module.exports.create = create;