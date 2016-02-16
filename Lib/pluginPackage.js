"use strict";

/**
 * Created by daudiihhdau on 16.12.15.
 */

function PluginPackage()
{
    var name;
    var description;
    var direction;
    var packageCollection;

    return {
        init: function (packageDefinition) { //(options){
            // jQuery Methode zum Mischen der Benutzer-
            // mit den Default-Optionen
            //_opts = $.extend(_defaults, options);

            name = packageDefinition.name;
            description = packageDefinition.description;
            direction = packageDefinition.direction;

            packageCollection = db.addCollection(name);

            return this;
        },
        getName: function () {
            return name;
        },
        getDirection: function () {
            return direction;
        },
        getDescription: function () {
            return description;
        },
        getItems: function () {
            return packageCollection.chain().data();
        },
        fill: function (data) {
            _.each(data.items, function(itemOn) {
                packageCollection.insert(itemOn);
            });
            return this;
        }
    }
};

function create(packageDefinition)
{
    return new PluginPackage().init(packageDefinition);
};

module.exports.create = create;