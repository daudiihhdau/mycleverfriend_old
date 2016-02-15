/**
 * Created by daudiihhdau on 16.12.15.
 */

async = require('async');
_ = require('underscore');
var lokijs = require('lokijs');
db = new lokijs('MyCleverFriend');
var pluginProxy = require('./pluginProxy.js');

function Mission()
{
    var mission_version;
    var name;
    var version;
    var author;
    var description;
    var tags;
    var pluginProxies = [];


    function createPluginProxies(pluginDefinitions) {
        _.each(pluginDefinitions, function(pluginDefinitionOn) {
            pluginProxies.push(pluginProxy.create(pluginDefinitionOn));
        })
    }

    return {
        init: function (missionDefinition) { //(options){
            // jQuery Methode zum Mischen der Benutzer-
            // mit den Default-Optionen
            //_opts = $.extend(_defaults, options);

            mission_version = missionDefinition.mission_version;
            name = missionDefinition.specification.name;
            version = missionDefinition.specification.version;
            author = missionDefinition.specification.author;
            description = missionDefinition.specification.description;
            tags = missionDefinition.specification.tags;

            pluginProxies = [];
            createPluginProxies(missionDefinition.plugins);

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
        start : function () {

            console.log("Trying to start the mission.");

            _.each(pluginProxies, function(pluginProxyOn) {

                console.log("starte plugin " + pluginProxyOn.getName() + "from: " + pluginProxyOn.getPath());

                pluginProxyOn.start();

            })
        }
    }
}

function create(missionDefinition)
{
    return new Mission().init(missionDefinition);
}

module.exports.create = create;