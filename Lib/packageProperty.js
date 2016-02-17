"use strict";

/**
 * Created by daudiihhdau on 16.12.15.
 */

function PackageProperty()
{
    var type;
    var description;
    var defaultValue;
    var validation;

    return {
        init: function (propertyDefinition) {

            type = propertyDefinition.type;
            description = propertyDefinition.description;
            defaultValue = propertyDefinition.defaultValue ? propertyDefinition.defaultValue : undefined;
            validation = propertyDefinition.validation ? propertyDefinition.validation : undefined;

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

function create(propertyDefinition)
{
    return new PackageProperty().init(propertyDefinition);
};

module.exports.create = create;