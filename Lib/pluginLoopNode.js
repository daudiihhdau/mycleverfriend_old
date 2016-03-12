/**
 * Created by daudiihhdau on 16.12.15.
 */

//https://blog.risingstack.com/fundamental-node-js-design-patterns/
//https://blog.risingstack.com/dependency-injection-in-node-js/

// todo
function PluginLoopNode()
{
    var pluginProxies = [];

    return {
        init: function (options) {

            if (!options.pluginProxies) throw new Error('options.pluginProxies is required');

            return this;
        },
        add: function (pluginNode) {

        },
        moveNext: function () {

        }
    }
}

function create(options)
{
    return new PluginLoopNode().init(options);
}

module.exports.create = create;