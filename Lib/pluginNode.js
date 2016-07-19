"use strict";

/**
 * Created by daudiihhdau on 16.12.15.
 */
// http://robertnyman.com/2008/10/14/javascript-how-to-get-private-privileged-public-and-static-members-properties-and-methods/
// http://robertnyman.com/2008/10/09/explaining-javascript-scope-and-closures/

// = plugin proxy
function PluginNode()
{
    var id;
    var parent;
    var name;
    var description;
    var author;
    var license;
    var version;
    var pluginProxy;
    var packages = {};

    function getPackageByName(packageName) {

        if (!packageName) throw Error("Missing package definitions.");
        packageName = packageName.toLowerCase();

        if (false == _.has(packages, packageName)) throw Error("invalid package name: " + packageName);

        return packages[packageName];
    }

    function getPackagesByDirection(direction) {

        if (!direction) throw Error("Missing package direction");
        direction = direction.toLowerCase();

        if (direction !== 'in' && direction !== 'out') throw new Error('package direction must be: IN or OUT, given: ' + direction);

        var foundPackages = [];
        _.each(packages, function(packageOn) {
            if (packageOn.getDirection() == direction) foundPackages.push(packageOn);
        });
        return foundPackages;
    }

    function getPackagesWithReference() {

        var foundPackages = [];
        _.each(getPackages('IN'), function(packageOn) {
            if (true == packageOn.hasReference()) foundPackages.push(packageOn);
        });
        return foundPackages;
    }

    return {
        init: function(options) {

            // todo: check is number? (test: "is not existing" gives wrong answers using pluginId = 0)
            if (id in options) throw new Error('options.id is required');
            if (!options.parent) throw new Error('options.parent is required');
            if (!options.name) throw new Error('options.name is required');
            if (!options.description) throw new Error('options.description is required');
            if (!options.author) throw new Error('options.author is required');
            if (!options.license) throw new Error('options.license is required');
            if (!options.version) throw new Error('options.version is required');
            if (!options.work) throw new Error('options.work is required');
            if (!options.packages) throw new Error('options.packages is required');

            id = options.id;
            parent = options.parent;
            name = options.name.toLowerCase();
            description = options.description;
            author = options.author;
            license = options.license;
            version = options.version;
            pluginProxy = options.work;
            packages = options.packages;

            return this;
        },
        getId: function() {
            return id;
        },
        getUniqueId: function() {
            return id + '_' + name;
        },
        getParent: function() {
            return parent;
        },
        getName: function() {
            return name;
        },
        getVersion: function() {
            return version;
        },
        getPath: function() {
            return getPluginPath();
        },
        getPackages: function() {
            return packages;
        },
        getPackageByName: function(packageName) {
            return getPackageByName(packageName);
        },
        getPackagesByDirection: function(direction) {
            return getPackagesByDirection(direction);
        },
        getPackagesWithReference: function () {
            return getPackagesWithReference();
        },
        start: function(dbProxy, callback) {
            pluginProxy(dbProxy, callback);
            return this;
        }
    }
};

function create(options, callback)
{
    return new PluginNode().init(options);
}

module.exports.create = create;