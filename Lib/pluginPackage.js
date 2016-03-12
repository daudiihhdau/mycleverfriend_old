"use strict";

/**
 * Created by daudiihhdau on 16.12.15.
 */

var helper = require('./helper.js');
var packageProperty = require('./packageProperty.js');

function PluginPackage()
{
    var name;
    var description;
    var direction;
    var dbCollection;
    var properties = {};
    var reference;

    function addDocuments(documents) {

        _.each(documents, function(documentOn) {
            addDocument(documentOn)
        });
    }

    function addDocument(document) {

        document = helper.convertKeysToLowerCase(document);

        // ignore invalid elements
        var cleanedDocument = _.pick(document, _.keys(properties));

        // ignore all elements with missing elements
        if (_.size(cleanedDocument) == _.size(properties)) {
            dbCollection.insert(cleanedDocument);
        }

        // todo: write to error log
    }

    return {
        init: function (options) {

            if (!options.name) throw new Error('options.name is required');
            if (!options.direction) throw new Error('options.direction is required');
            if (!options.description) throw new Error('options.description is required');
            if (!options.dbCollection) throw new Error('options.dbCollection is required');
            if (!options.properties) throw new Error('options.properties is required');

            name = options.name;
            direction = options.direction;
            description = options.description;
            dbCollection = options.dbCollection;
            properties = options.properties;

            if (options.input) {

                if (true == _.has(options.input, 'data')) {
                    addDocuments(options.input.data);
                }
                else if (true == _.has(options.input, 'linked')) {

                    if ('In' != direction) throw new Error('linked package must be input package');

                    reference = options.linked ? options.linked : undefined;
                }
            }

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
        isSoftPackage: function () {
            return false; // todo: return correct value
        },
        hasReference: function () {
            return reference ? true : false;
        },
        getReference: function () {
            return reference;
        },
        getDocuments: function () {
            return dbCollection.data;
        },
        addDocument: function (document) {
            addDocument(document);
        },
        addDocuments: function (documents) {
            addDocuments(documents);
        }
    }
};

function create(options)
{
    return new PluginPackage().init(options);
};

module.exports.create = create;