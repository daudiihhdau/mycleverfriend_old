"use strict";

/**
 * Created by daudiihhdau on 16.12.15.
 */

var packageProperty = require('./packageProperty.js');
var missionPlugin = require('./missionPlugin.js')

function PluginPackage()
{
    var name;
    var description;
    var direction;
    var packageCollection;
    var properties = {};

    function addDocument(document) {
        // ignore invalid elements
        var cleanedDocument = _.pick(document, _.keys(properties));

        // ignore all elements with missing elements
        if (_.size(cleanedDocument) == _.size(properties)) {
            packageCollection.insert(cleanedDocument);
        }

        // todo: write to error log
    }

    return {
        init: function (packageDefinition) {

            name = packageDefinition.name;
            direction = packageDefinition.direction;
            description = packageDefinition.description;

            // create package properties
            _.each(packageDefinition.properties, function(propertyDefinitionOn, propertyName) {
                properties[propertyName.toLowerCase()] = packageProperty.create(propertyDefinitionOn);;
            });

            packageCollection = db.addCollection(name);
            packageCollection.on("pre-insert", function (data) {
                //console.log(data);
            })

            return this;
        },
        getName: function () {
            return name;
        },
        getDirection: function () {
            return direction;
        },
        getDescription: function () {
            return description;
        },
        getDocuments: function () {
            return packageCollection.data;
        },
        addDocument: function (document) {
            addDocument(document)
        },
        addDocuments: function (documents) {
            _.each(documents, function(documentOn) {
                addDocument(documentOn)
            });
            return this;
        }
    }
};

function create(packageDefinition)
{
    return new PluginPackage().init(packageDefinition);
};

module.exports.create = create;