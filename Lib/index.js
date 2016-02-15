"use strict";

//todo: logging

var missionReader = require('./missionReader.js');

function load(filePath)
{
    missionReader.load(filePath, function (err, mission)
    {
        if (err) throw err;

        /*console.log(mission.getTags());
        console.log(mission.getPlugins()[0].getPackages("Input")[0].getName());
        console.log(mission.getPlugins()[0].getPackages("Input")[1].getItems());
        console.log(mission.getPlugins()[0].getPackages("Output")[0].getName());*/

        mission.start();
    });
}

module.exports = {
    readMissionFile: load,
    start: null
}