module.exports = {
    convertKeysToLowerCase: function (obj) {

        var newObj = {};

        _.each(obj, function(value, key) {
            newObj[key.toLowerCase()] = value;
        });

        return newObj;
    }
}
