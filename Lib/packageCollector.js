"use strict";

/**
 * Created by daudiihhdau on 16.12.15.
 */

function PackageCollector()
{
    var packages = {};

    function getPackages(direction) {

        if (!direction) throw Error("Missing package direction");
        direction = direction.toLowerCase();

        if (direction !== 'in' || direction !== 'out') throw new Error('package direction must be: IN or OUT');

        var foundPackages = [];
        _.each(packages, function(packageOn) {
            if (packageOn.getDirection() == direction) foundPackages.push(packageOn);
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
        init: function (options) {

            if (!options.packages) throw Error("Missing options.packages.");

            packages = options.packages;

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

function create(options)
{
    return new PackageCollector().init(options);
};

module.exports.create = create;
