/**
 * Created by daudiihhdau on 16.12.15.
 */

var lokijs = require('lokijs');
var pluginProxy = require('./pluginProxy.js');

_ = require('underscore');
db = null;

module.exports = function()
{
    var mission_version;
    var name;
    var version;
    var author;
    var description;
    var tags;
    var plugins = [];


    function createPluginProxies(pluginDefinitions) {
        _.each(pluginDefinitions, function(pluginDefinitionOn) {
            plugins.push(pluginProxy.init(pluginDefinitionOn));
        })
    }

    return {
        init: function (missionDefinition) { //(options){
            // jQuery Methode zum Mischen der Benutzer-
            // mit den Default-Optionen
            //_opts = $.extend(_defaults, options);

            db = new lokijs(name);

            mission_version = missionDefinition.mission_version;
            name = missionDefinition.specification.name;
            version = missionDefinition.specification.version;
            author = missionDefinition.specification.author;
            description = missionDefinition.specification.description;
            tags = missionDefinition.specification.tags;

            plugins = [];
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
            return plugins;
        }
    }
}();