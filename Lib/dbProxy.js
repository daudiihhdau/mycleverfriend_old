"use strict";

function DbProxy()
{
    var db;

    function createPackageCollections(pluginNode, callback) {
        var packages = pluginNode.getPackages();
        _.each(['input', 'output'], function (directionOn) {
            _.each(packages[directionOn], function (packageOn) {
                db.createPackage(pluginNode.getId(), packageOn.getName())
            });
        });
        return callback(null, pluginNode);
    }

    function loadInputData(packageOn, inputData, callback) {
        if (true == packageOn.hasInputData()) {
            inputData = packageOn.getInputData(); //[packageOn.getName()]
        }
        return callback(null, packageOn, inputData);
    }

    function loadLinkedData(packageOn, inputData, callback) {
        if (true == packageOn.hasReference()) {
            var packageReference = packageOn.getReference();
            inputData = db.getPackage(packageReference.pluginId, packageReference.packageName.toLowerCase());
        }
        return callback(null, packageOn, inputData);
    }

    function addDocuments(pluginNode, inputData, callback) {
        _.each(inputData, function(documents, packageNameOn) {
            _.each(documents, function(documentOn) {
                var cleanedDocument = pluginNode.getPackageByName(packageNameOn).cleanupInputDocument(documentOn);

                if (cleanedDocument) {
                    db.addDocument(pluginNode.getId(), packageNameOn, cleanedDocument);
                }
            });
        });
        return callback(null, pluginNode, db.getPackages(pluginNode.getId()));
    }

    function loadInputPackageData(inputPackage, callback) {
        async.waterfall([
            function(cb) { return cb(null, inputPackage, {}) },
            loadInputData,
            loadLinkedData,
        ], function (err, inputPackageOn, inputData) {
            if (err) throw err;
            return callback(err, inputData);
        });
    }

    return {
        init: function (options) {
            if (!options.db) throw new Error('options.db is required');
            // TODO: is db a valid database? (having all needed methods - duck typing)

            db = options.db;

            return this;
        },
        createCollections: function (pluginNodeOn, callback) {
            createPackageCollections(pluginNodeOn, callback);
        },
        loadData: function (pluginNodeOn, callback) {
            async.map(pluginNodeOn.getPackagesByDirection('input'), loadInputPackageData, function (err, inputData) {
                if (err) throw err;
                addDocuments(pluginNodeOn, inputData, callback);
            });
        },
        saveData: function (pluginNode, packages, callback) {
            addOutputData(pluginNode, packages, callback);
        },
        getData: function () {
            return db.getAll();
        }
    }
}

function create(options)
{
    return new DbProxy().init(options);
}

module.exports.create = create;