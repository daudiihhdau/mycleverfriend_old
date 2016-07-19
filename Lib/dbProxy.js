"use strict";

function DbProxy()
{
    var db;

    function createPackageSlots(pluginNode, callback) {

        var packages = pluginNode.getPackages();
        _.each(packages, function (packageOn) {
            db.create(pluginNode.getUniqueId(), packageOn.getName())
        });
        callback(null, pluginNode);
    }

    function loadInputData(pluginNode, callback) {

        var inputData = [];
        var packages = pluginNode.getPackagesByDirection('IN');
        _.each(packages, function (packageOn) {
            if (true == packageOn.hasInputData()) {
                addDocuments(pluginNode, packageOn.getName(), packageOn.getInputData());
            }
        });
        callback(null, pluginNode, inputData);
    }

    function addDocument(pluginNode, packageName, document) {
        var cleanedDocument = pluginNode.getPackageByName(packageName).cleanupInputDocument(document);

        if (cleanedDocument) {
            db.add(pluginNode.getUniqueId(), packageName, cleanedDocument);
        }
        return true;
    }

    function addDocuments(pluginNode, packageName, documents) {
        _.each(documents, function(documentOn) {
            addDocument(pluginNode, packageName, documentOn)
        });
        return true;
    }

    return {
        init: function (options) {

            if (!options.db) throw new Error('options.db is required');
            // TODO: is db a valid database? (having all needed methods - duck typing)

            db = options.db;

            return this;
        },
        prepareData: function (pluginNodeOn, callback) {

            async.waterfall([
                function(callback) { return callback(null, pluginNodeOn) },
                createPackageSlots,
                loadInputData,
            ], function (err, pluginNodeOn) {
                if (err) throw err;
                return callback(null, pluginNodeOn, db.get(pluginNodeOn.getUniqueId()))
            });
        },
        saveData: function (pluginNode, packages) {

            //addDocuments
            return callback(null, pluginNodeOn);;
        }
    }
}

function create(options)
{
    return new DbProxy().init(options);
}

module.exports.create = create;