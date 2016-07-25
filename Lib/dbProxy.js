"use strict";

function DbProxy()
{
    var db;

    function createPackages(pluginNode, callback) {
        var packages = pluginNode.getPackages();
        _.each(packages, function (packageOn) {
            db.createPackage(pluginNode.getId(), packageOn.getName())
        });
        callback(null, pluginNode);
    }

    function loadInputDocuments(pluginNode, callback) {
        var packageValues = {};

        var packages = pluginNode.getPackagesByDirection('IN');
        _.each(packages, function (packageOn) {
            if (true == packageOn.hasInputData()) {
                packageValues[packageOn.getName()] = packageOn.getInputData();
            }
        });
        callback(null, pluginNode, packageValues);
    }

    function loadReferenceData(pluginNode, callback) {
        var packageValues = {};

        var packages = pluginNode.getPackagesByDirection('IN');
        _.each(packages, function (packageOn) {
            if (true == packageOn.hasReference()) {
                var packageReference = packageOn.getReference();
                packageValues[packageOn.getName()] = db.getPackage(packageReference.pluginId, packageReference.packageName.toLowerCase());
            }
        });
        //console.log(packageValues);

        callback(null, pluginNode, packageValues);
    }

    function addDocument(pluginNode, packageName, document) {
        var cleanedDocument = pluginNode.getPackageByName(packageName).cleanupInputDocument(document);

        if (cleanedDocument) {
            db.addDocument(pluginNode.getId(), packageName, cleanedDocument);
        }
        return true;
    }

    function addDocuments(pluginNode, packages, callback) {
        _.each(packages, function (documents, packageNameOn) {
            _.each(documents, function(documentOn) {
                addDocument(pluginNode, packageNameOn, documentOn)
            });
        });
        callback(null, pluginNode);
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
                createPackages,
                loadInputDocuments,
                addDocuments,
                loadReferenceData,
                addDocuments,
            ], function (err, pluginNodeOn) {
                if (err) throw err;
                return callback(null, pluginNodeOn, db.getPackages(pluginNodeOn.getId()))
            });
        },
        saveData: function (pluginNode, packages, callback) {
            // TODO: validate data and package name
            addDocuments(pluginNode, packages, callback);

            //return callback(null, pluginNode);
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