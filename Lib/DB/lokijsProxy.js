"use strict";

var lokijs = require('lokijs');

/*
verwaltet alle DB

stellt richtig gefüllte Packages zur Verfügungs
 kann Verknüpfungen auflösen
 */

function DbProxy()
{
    var db;

    function prepareData(pluginNodeOn) {

    }

    /*function createDbProxy(pluginNodeOn, callback) {
        console.log('create pluginDbProxy for plugin: ' + pluginNodeOn.getName());

        var pluginDbProxy = DbProxy.create({
            'db': db,
            'pluginNode': pluginNodeOn
        });

        return callback(null, pluginNodeOn, pluginDbProxy);
    }

    function setupDbProxy(pluginNodeOn, pluginDbProxy, callback) {
        console.log('prepare data for plugin: ' + pluginNodeOn.getName());

        pluginDbProxy.setup(function (err) {
            if (err) throw err;

            return callback(null, pluginNodeOn, pluginDbProxy);
        });
    }*/

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
        init: function (callback) {

            db = new lokijs('example.db');

            return this;
        },
        prepareData: function (callback) {
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