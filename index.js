"use strict";

const Hapi = require('hapi');
var myCleverFriend = require('./Lib');

const server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: 8000
});

server.route({
    method: 'GET',
    path: '/{mission}',
    handler: function (request, reply) {

        //./Data/Missions/SearchFiles.json;
        //./Data/Missions/AmazonHighlights2.json
        myCleverFriend.readMissionFile('./Data/Missions/' + encodeURIComponent(request.params.mission), function (err, mission) {
            if (err) if (err) throw reply(err);

            /*console.log(mission.getTags());
             console.log(mission.getPlugins()[0].getPackages("Input")[0].getName());
             console.log(mission.getPlugins()[0].getPackages("Input")[0].getItems());
             console.log(mission.getPlugins()[0].getPackages("Output")[0].getName());*/

            mission.start(function (err) {
                if (err) throw reply(err);

                reply(mission.getPlugins()[0].getPackages("Out")[0].getDocuments());
            })
        });
    }
});

server.start((err) => {

    if (err) {
    throw err;
}
console.log('Server running at:', server.info.uri);
});