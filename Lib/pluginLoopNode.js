/**
 * Created by daudiihhdau on 16.12.15.
 */

//https://blog.risingstack.com/fundamental-node-js-design-patterns/
//https://blog.risingstack.com/dependency-injection-in-node-js/
function PluginLoopNode()
{
    var pluginProxies = [];

    return {
        init: function (options) {

            return this;
        },
        // todo: add new pluginProxy and pluginCollector here
        add: function (pluginNode) {

            if (!pluginNode) throw Error("Missing pluginNode.");

            // todo: test is type of pluginNode

            pluginProxies.push(pluginNode);
            return this;
        }
    }
}

function create(options)
{
    return new PluginLoopNode().init(options);
}

module.exports.create = create;