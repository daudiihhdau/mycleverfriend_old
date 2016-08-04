"use strict";


module.exports.packageTypes = {
    input:  {
        something: {
            description: "You can put everything inside here! It will be lost anyway!",
            properties: { }
        }
    },
    output: {}
};

module.exports.work = function(packages, callback) {

    return callback(null, packages);
}


