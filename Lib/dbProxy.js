"use strict";

function DbProxy()
{
    var db;

    function createPackagesDB(pluginNode, callback) {
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
            inputData = packageOn.getInputData();
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

    function addDocuments(pluginNode, data, callback) {
        _.each(data, function (documents, packageNameOn) {
            _.each(documents, function (documentOn) {
                var cleanedDocument = pluginNode.getPackageByName(packageNameOn).cleanupInputDocument(documentOn);

                if (cleanedDocument) {
                    db.addDocument(pluginNode.getId(), packageNameOn, cleanedDocument);
                }
            });
        });
        return callback(null, pluginNode);
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
        createPackages: function (pluginNodeOn, callback) {
            createPackagesDB(pluginNodeOn, callback);
        },
        preparePackages: function (pluginNodeOn, callback) {
            async.map(pluginNodeOn.getPackagesByDirection('input'), loadInputPackageData, function (err, inputData) {
                if (err) throw err;
                addDocuments(pluginNodeOn, inputData, callback);
            });
        },
        getPackages: function (pluginNode, callback) {
            var packages = { input: {}, output: {}};
            _.each(['input', 'output'], function(directionOn) {
                _.each(pluginNode.getPackagesByDirection(directionOn), function(packageOn) {
                    // use slice(0) to copy all array elements by value
                    packages[directionOn][packageOn.getName()] = db.getPackage(pluginNode.getId(), packageOn.getName()).slice(0);
                });
            });
            return callback(null, pluginNode, packages);
        },
        savePackages: function (pluginNode, packages, callback) {
            addDocuments(pluginNode, packages.output, callback);
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