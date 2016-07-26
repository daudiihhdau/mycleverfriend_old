"use strict";

/**
 * Created by daudiihhdau on 16.12.15.
 */

var helper = require('./helper.js');

function PluginPackage()
{
    var uniqueId;
    var name;
    var description;
    var direction;
    var properties = {};
    var inputData = {};
    var queryReference;

    function cleanupInputDocument(document) {
        document = helper.convertKeysToLowerCase(document);

        // ignore invalid elements
        var cleanedDocument = _.pick(document, _.keys(properties));

        // ignore all elements with missing elements
        if (_.size(cleanedDocument) != _.size(properties)) {
            return null;
        }
        return cleanedDocument;
    }

    return {
        init: function (options) {

            if (!options.name) throw new Error('options.name is required');
            if (!options.description) throw new Error('options.description is required');
            if (!options.properties) throw new Error('options.properties is required');

            //uniqueId = guid();
            name = options.name;
            description = options.description;
            properties = options.properties;

            if (true == _.has(options.input, 'data')) {
                inputData = options.input.data;
            }

            if (true == _.has(options.input, 'linked')) {
                if (false == _.isEmpty(inputData)) throw new Error('linked package: inputData should be empty');

                queryReference = options.input.linked;
            }

            return this;
        },
        getUniqueId: function () {
            return name + '_' + uniqueId;
        },
        getName: function () {
            return name.toLowerCase();
        },
        getDirection: function () {
            return direction.toLowerCase();
        },
        getDescription: function () {
            return description;
        },
        hasInputData: function () {
            return  (false == _.isEmpty(inputData));
        },
        getInputData: function () {
            return inputData;
        },
        hasReference: function () {
            return (false == _.isEmpty(queryReference));
        },
        getReference: function () {
            return queryReference;
        },
        cleanupInputDocument: function (document) {
            return cleanupInputDocument(document);
        }
    }
};

function create(options)
{
    return new PluginPackage().init(options);
};

module.exports.create = create;