"use strict";


module.exports.packageTypes = {
    input:  {
        origin: {
            description: "You can put everything inside here!",
            properties: { }
        }
    },
    output: {
        copy: {
            description: "It's the copy of the input packages.",
            properties: { }
        }
    }
};

module.exports.work = function(packages, callback) {

    packages.output['copy'] = packages.input['origin'];

    return callback(null, packages);
}


