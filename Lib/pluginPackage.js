"use strict";

/**
 * Created by daudiihhdau on 16.12.15.
 */

var packageProperty = require('./packageProperty.js');

function PluginPackage()
{
    var name;
    var description;
    var direction;
    var dbCollection;
    var packageProperties = {};

    function addDocument(document) {

        // set lowerCase to every key
        var lowerCaseDocument = {};
        _.each(document, function(value, key) {
            lowerCaseDocument[key.toLowerCase()] = value;
        });

        // ignore invalid elements
        var cleanedLowerCaseDocument = _.pick(lowerCaseDocument, _.keys(packageProperties));

        // ignore all elements with missing elements
        if (_.size(cleanedLowerCaseDocument) == _.size(packageProperties)) {
            dbCollection.insert(cleanedLowerCaseDocument);
        }

        // todo: write to error log
    }

    return {
        init: function (options) {

            if (!options.name) throw new Error('options.name is required');
            if (!options.direction) throw new Error('options.direction is required');
            if (!options.description) throw new Error('options.description is required');
            if (!options.dbCollection) throw new Error('options.dbCollection is required');
            if (!options.packageProperties) throw new Error('options.packageProperties is required');

            name = options.name;
            direction = options.direction;
            description = options.description;
            dbCollection = options.dbCollection;
            packageProperties = options.packageProperties;

            dbCollection.on("pre-insert", function (data) {
                //console.log(data);
            })

            return this;
        },
        getName: function () {
            return name;
        },
        getDirection: function () {
            return direction.toLocaleLowerCase();
        },
        getDescription: function () {
            return description;
        },
        hasReference: function () {
            return null;
        },
        getDocuments: function () {
            return dbCollection.data;
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

function create(options)
{
    return new PluginPackage().init(options);
};

module.exports.create = create;