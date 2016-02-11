/**
 * Created by daudiihhdau on 16.12.15.
 */

fs = require('fs');
mission = require('./mission.js');

function readMissionFile(filepath, callback)
{
    var filepath = filepath;

    fs.readFile(filepath, 'utf8', function (err, data) {

        if (err) return callback(new Error(err));

        missionObj = JSON.parse(data);
        //todo: json validieren

        callback(null, mission.create(missionObj));
    })
}

module.exports = {
    load: readMissionFile,
}