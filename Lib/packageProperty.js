"use strict";

/**
 * Created by daudiihhdau on 16.12.15.
 */

function PackageProperty()
{
    var name;
    var type;
    var description;
    var defaultValue;
    var validation;

    return {
        init: function (options) {

            if (!options.name) throw new Error('options.name is required');
            if (!options.type) throw new Error('options.type is required');
            if (!options.description) throw new Error('options.description is required');

            name = options.name;
            type = options.type;
            description = options.description;
            defaultValue = options.defaultValue ? options.defaultValue : undefined;
            validation = options.validation ? options.validation : undefined;

            return this;
        },
        getName: function () {
            return name;
        },
        getType: function () {
            return type;
        },
        getDescription: function () {
            return description;
        },
        getDefaultValue: function () {
            return defaultValue;
        },
        getValidation: function () {
            return validation;
        }
    }
};

function create(options)
{
    return new PackageProperty().init(options);
};

module.exports.create = create;