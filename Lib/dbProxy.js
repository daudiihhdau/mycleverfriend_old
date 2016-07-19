"use strict";

function DbProxy()
{
    var db;

    function createPluginSlot(pluginNode, callback) {

        var packages = pluginNode.getPackagesByDirection('IN');
        async.map(packages,
            function (packageOn, callback) {

                var packageDbCollection = db.addCollection(packageOn.getName());

                if (true == packageOn.hasReference()) {
                    throw new Error('TODO!!');
                }

                if (true == packageOn.hasInputData()) {
                    addDocuments(packageOn.getName(), packageOn.getInputData());
                }

                return callback(null, packageDbCollection);
            },
            function(err) {
                if (err) throw err;

                return callback(null);
            });
    }

    function addDocument(packageName, document) {
        var cleanedDocument = pluginNode.getPackageByName(packageName).cleanupInputDocument(document);

        if (cleanedDocument) {
            console.log(cleanedDocument);
            db.insert(packageName, cleanedDocument);
        }
        return true;
    }

    function addDocuments(packageName, documents) {
        _.each(documents, function(documentOn) {
            addDocument(packageName, documentOn)
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
            return createPluginSlot(pluginNodeOn, callback);
        },
        saveData: function (pluginNode, packageName) {
            return db.get();
        }
    }
}

function create(options)
{
    return new DbProxy().init(options);
}

module.exports.create = create;