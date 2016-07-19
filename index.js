"use strict";

const Hapi = require('hapi');
var myCleverFriend = require('./Lib');
var lokijsProxy = require('./Lib/DB/lokijsProxy.js');

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
        myCleverFriend.load('./Data/Missions/' + encodeURIComponent(request.params.mission), function (err, mission) {

            if (err) if (err) throw reply(err);

            /*console.log(mission.getName());
            console.log(mission.getVersion());
            console.log(mission.getAuthor());
            console.log(mission.getDescription());
            console.log(mission.getTags());

            console.log(mission.getPlugins());
            console.log(mission.getPlugins()[0].getPackages().getByDirection("In")[0].getName());
            console.log(mission.getPlugins()[0].getPackages().getByDirection("In")[0].getDocuments());
            console.log(mission.getPlugins()[0].getPackages().getByDirection("Out")[0].getName());
            console.log(mission.getPlugins()[0].getPackages().getByDirection("Out")[0].getDocuments());*/

            mission.start(dbProxy.create(), function (err, resultSet) {
                if (err) throw reply(err);

                reply(resultSet);
                //reply(mission.getPlugins()[0].getPackagesByDirection("Out")[0].getDocuments());
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