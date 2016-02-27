/**
 * Created by daudiihhdau on 16.12.15.
 */

async = require('async');
_ = require('underscore');
var lokijs = require('lokijs');
db = new lokijs('MyCleverFriend');
var pluginProxy = require('./pluginProxy.js');

// todo: use dependency injection for the database
//https://blog.risingstack.com/fundamental-node-js-design-patterns/
//https://blog.risingstack.com/dependency-injection-in-node-js/
function Mission()
{
    var mission_version;
    var name;
    var version;
    var author;
    var description;
    var tags;
    var pluginProxies = [];

    return {
        init: function (missionObj) {

            mission_version = missionObj.mission_version;
            name = missionObj.specification.name;
            version = missionObj.specification.version;
            author = missionObj.specification.author;
            description = missionObj.specification.description;
            tags = missionObj.specification.tags;

            pluginProxies = [];
            _.each(missionObj.plugins, function(missionObjPluginOn) {
                pluginProxies.push(pluginProxy.create(missionObjPluginOn));
            })

            return this;
        },
        getName: function () {
            return name;
        },
        getVersion: function () {
            return version;
        },
        getAuthor: function () {
            return author;
        },
        getDescription: function () {
            return description;
        },
        getTags: function () {
            return tags;
        },
        getPlugins: function () {
            return pluginProxies;
        },
        start : function (callback) {

            console.log("Trying to start the mission.");

            _.each(pluginProxies, function(pluginProxyOn) {
                console.log('starte plugin "' + pluginProxyOn.getName() + '" using: ' + pluginProxyOn.getPath());
                pluginProxyOn.start(callback);
            });
        }
    }
}

function create(missionObj)
{
    return new Mission().init(missionObj);
}

module.exports.create = create;