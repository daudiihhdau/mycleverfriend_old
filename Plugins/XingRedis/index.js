"use strict";

/**
 * Created by daudiihhdau on 17.12.15.
 */
var redis = require('redis');

module.exports.packageTypes = {
    input: {
        xingNonFreelancers: {
            description: "Defines all xing users, which are not Freelancers",
            properties: {
                id:                 { type:   "string",   description: "Id of the xing user" },
                employmentstatus:   { type:   "string",   description: "Employement status of the xing user." },
            }

        }
    },
    output: {
        redisInfo: {
            description: "Defines the ...",
            properties: {
                numSavedUsers:      { type:   "int",   description: "Number of successfully saved xing users." },
            }
        }
    }
};

module.exports.work = function(packages, callback) {

    var client = redis.createClient();

    var dateObj = new Date();
    dateObj.setDate(new Date().getDate() - 1);

    var usersToday = _.map(packages.input['xingnonfreelancers'], function(userOn){ return userOn.id; });
    usersToday.unshift(dateObj.toISOString().slice(0,10) + ':nonFreelancers'); // set redisKey as first item


    // open redis connection
    client.on('connect', function() {

        // save nonFreelancers of today
        client.sadd(usersToday, function(err, reply) {
            packages.output['redisinfo'].push({ 'numSavedUsers': reply });
        });

        async.map(packages.input['xingnonfreelancers'], saveUserData, function(err, results) {
            return callback(err, packages);
        });
    });

    function saveUserData(userOn, cb) {
        client.hmset('user:' + userOn.id, userOn, cb);
    }
}


