"use strict";

/**
 * Created by daudiihhdau on 17.12.15.
 */
var redis = require('redis');

module.exports.packageTypes = {
    input: { },
    output: {
        newXingFreelancers: {
            description: "Defines all new found xing freelancers.",
            properties: { }
        }
    }
};

module.exports.work = function(packages, callback) {

    var client = redis.createClient();

    var todayDateObj = new Date();
    var yesterdayDateObj =  new Date();
    yesterdayDateObj.setDate(todayDateObj.getDate() - 1);

    // open redis connection
    client.on('connect', function() {

        // save nonFreelancers of today
        client.sdiff(getRedisKeyName(todayDateObj), getRedisKeyName(yesterdayDateObj), function(err, nonFreelancerIds) {

            async.map(nonFreelancerIds, requestRedisXingUser, function(err, nonFreelancers) {
                if (err) throw err;
                client.quit();

                packages.output['newxingfreelancers']= nonFreelancers;

                return callback(err, packages);
            });
        });
    });

    function getRedisKeyName(dateObj) {
        return dateObj.toISOString().slice(0,10) + ':nonFreelancers';
    }

    function requestRedisXingUser(nonFreelancerId, cb) {
        client.hgetall('user:' + nonFreelancerId, cb)
    }
}


