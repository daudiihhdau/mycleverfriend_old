"use strict";

/*
verwaltet alle DB

stellt richtig gefüllte Packages zur Verfügungs
 kann Verknüpfungen auflösen
 */

function DbProxy()
{
    var db;
    var pluginNode;

    function setup(callback) {

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
        init: function (options, callback) {

            if (!options.db) throw new Error('options.db is required');
            if (!options.pluginNode) throw new Error('options.pluginNode is required');

            db = options.db;
            pluginNode = options.pluginNode;

            return this;
        },
        setup: function (callback) {
            return setup(callback);
        },
        get: function (packageName) {
            return db.getCollection(packageName).data;
        },
        add: function (packageName, document) {
            addDocument(packageName, document);
        }/*,
        addBulk: function (packageName, documents) {
            addDocuments(packageName, documents);
        }*/
    }
}

function create(options)
{
    return new DbProxy().init(options);
}

module.exports.create = create;