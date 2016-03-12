"use strict";

/**
 * Created by daudiihhdau on 16.12.15.
 */

//https://blog.risingstack.com/fundamental-node-js-design-patterns/
//https://blog.risingstack.com/dependency-injection-in-node-js/
function Mission()
{
    var specifications;

    //var pluginLoopNode;
    var pluginProxies;

    return {
        init: function (options) {

            if (!options.specifications) {
                throw new Error('options.specifications is required');
            }
            /*if (!options.pluginLoopNode) {
                throw new Error('options.pluginLoopNode is required');
            }*/
            if (!options.pluginProxies) {
                throw new Error('options.pluginProxies is required');
            }

            specifications = options.specifications;
            //pluginLoopNode = options.pluginLoopNode;
            pluginProxies = options.pluginProxies;

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
            return pluginProxies;
        },
        start : function (callback) {

            console.log("Trying to start the mission.");

            _.each(pluginProxies, function(pluginProxyOn) {
                console.log('starte plugin "' + pluginProxyOn.getName()); // + '" using: ' + pluginProxyOn.getPath());
                pluginProxyOn.start(callback);
            });
        }
    }
}

function create(options)
{
    return new Mission().init(options);
}

module.exports.create = create;