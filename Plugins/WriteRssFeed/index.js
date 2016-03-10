"use strict";

/**
 * Created by daudiihhdau on 17.12.15.
 */
var feedWriter = require("feed");

module.exports.packageDefinitions = [
    {
        "name": "feedChannel",
        "direction": "In",
        "description": "Defines the rss-feed channel setting.",
        "properties": [
            {   "name": "title",        "type": "string",   "description": "Headline of the feed." },
            {   "name": "description",  "type": "string",   "description": "The description of this feed." },
            {   "name": "link",         "type": "url",      "description": "Link to the website of this feed." }
        ]
    },
    {
        "name": "feedItems",
        "direction": "In",
        "description": "Defines the item data which should written in rss-feed format.",
        "properties": [
            {   "name": "title",        "type": "string",   "description": "Headline of the feed item."},
            {   "name": "link",         "type": "url",      "description": "Link to the website of this feed item."},
            {   "name": "description",  "type": "string",   "description": "The article/text itself."}
        ]
    }
];

module.exports.work = function(packages, callback) {

    _.each(packages.get("feedChannel"), function(feedChannelOn) {
        var feed = new feedWriter(feedChannelOn);
        _.each(packages.get("feedItems"), function(feedItemOn) {
            feed.addItem(feedItemOn);
        });

        console.log(feed.render('rss-2.0'))
    });
}


