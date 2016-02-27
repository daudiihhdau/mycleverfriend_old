"use strict";

/**
 * Created by daudiihhdau on 16.12.15.
 */

var pluginPackage = require('./pluginPackage.js');

function PackageCollector()
{
    var packages = {};

    function getPackages(direction) {

        if (!direction) throw Error("Missing package direction");
        direction = direction.toLowerCase();

        var foundPackages = [];
        _.each(packages, function(inputDataOn, inputPackageNameOn) {
            if (packages[inputPackageNameOn].getDirection() == direction) foundPackages.push(packages[inputPackageNameOn]);
        });
        return foundPackages;
    }

    function add(packageName, newDocument) {

        if (!packageName) throw Error("Missing package definitions.");
        packageName = packageName.toLowerCase();

        if (true == Array.isArray(newDocument)) {
            packages[packageName].addDocuments(newDocument);
        }
        else {
            packages[packageName].addDocument(newDocument);
        }
    }

    return {
        init: function (packageDefinitions, missionObjPlugin) {

            if (!packageDefinitions) throw Error("Missing package definitions.");
            if (!missionObjPlugin) throw Error("Missing plugin data.");

            // create packages
            _.each(packageDefinitions, function(packageDefinitionOn, packageNameOn) {
                packages[packageNameOn.toLowerCase()] = pluginPackage.create(packageDefinitionOn);
            });

            // prepare packages
            _.each(missionObjPlugin.input, function(missionObjPluginOn, packageNameOn) {

                if (true == _.has(missionObjPluginOn, "data")) {
                    add(packageNameOn, missionObjPluginOn.data);
                }

                if (true == _.has(missionObjPluginOn, "linked")) {
                    console.log("LINKED");
                    console.log(missionObjPluginOn.linked);
                }
            });

            return this;
        },
        get: function(packageName) {

            if (!packageName) throw Error("Missing package definitions.");
            packageName = packageName.toLowerCase();

            if (false == _.has(packages, packageName)) throw Error("invalid package name: " + packageName);

            return packages[packageName].getDocuments();
        },
        getByDirection: function(direction) {
            return getPackages(direction);
        },
        add: function(packageName, newDocument) {
            add(packageName, newDocument);
        }
    }
};

function create(packageDefinitions, missionObjPlugin)
{
    return new PackageCollector().init(packageDefinitions, missionObjPlugin);
};

module.exports.create = create;
