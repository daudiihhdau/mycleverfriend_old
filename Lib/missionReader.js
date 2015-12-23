/**
 * Created by daudiihhdau on 16.12.15.
 */

fs = require('fs');
mission = require('./mission.js');

module.exports = function(filepath, callback)
{
    var filepath = filepath;

    fs.readFile(filepath, 'utf8', function (err, data) {

        if (err) return callback(new Error(err));

        missionObj = JSON.parse(data);
        //todo: json validieren

        var m = mission.init(missionObj);

        callback(null, m);
    })
}