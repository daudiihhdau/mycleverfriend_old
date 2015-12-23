"use strict";

//todo: logging

var missionReader = require('./Lib/missionReader.js');

var mission = {
    mission: null,
    load: function () {

        missionReader('./Data/Missions/AmazonHighlights2.json', function (err, mission)
        {
            if (err) throw err;

            console.log(mission.getTags());
            console.log(mission.getPlugins()[0].getPackages("Output")[0].getName());
            //console.log(mission.getPlugins()[0].getPackages("Input")[0].getName());
            //console.log(mission.getPlugins()[0].getPackageByName("URLInfo").getName());
        });
    },
    start: function() {

    }
}

mission.load();



/*var PluginPackage = require('./pluginPackage.js');
var packageTest = new PluginPackage(1, "pluginPackage", "blaaahhhh");
console.log(packageTest.getItems());*/