"use strict";

/**
 * Created by daudiihhdau on 17.12.15.
 */
var feedWriter = require("feed");

module.exports.packageTypes = {
    input: {
        feedchannel: {
            "description": "Defines the rss-feed channel setting.",
            "properties": {
                "title":        { "type": "string", "description": "Headline of the feed." },
                "description":  { "type": "string", "description": "The description of this feed." },
                "link":         { "type": "url", "description": "Link to the website of this feed." }
            }
        },
        feeditems: {
            "description": "Defines the item data which should written in rss-feed format.",
            "properties": {
                "title":        { "type": "string", "description": "Headline of the feed item."},
                "link":         { "type": "url",    "description": "Link to the website of this feed item."},
                "content":  { "type": "string", "description": "The article/text itself."}
            }
        }
    },
    output: {}
};

module.exports.work = function(packages, callback) {

    _.each(packages.input['feedchannel'], function(feedChannelOn) {

        var feed = new feedWriter(feedChannelOn);
        _.each(packages.input['feeditems'], function(feedItemOn) {
            feed.addItem(feedItemOn);
        });

        console.log(feed.render('rss-2.0'))

        return callback(err, packages);
    });
}


