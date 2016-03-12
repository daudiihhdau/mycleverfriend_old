"use strict";

/**
 * Created by daudiihhdau on 17.12.15.
 */
var feedReader = require("feed-read");

module.exports.packageDefinitions = [
    {
        "name": "urlInfo",
        "direction": "In",
        "description": "Defines the rss-feeds you like to subscribe for.",
        "properties": [
            {   "name": "numFeedItems", "type": "integer",  "description": "Numbers of feeds to store.", "defaultValue": 200},
            {   "name": "url",          "type": "url",      "description": "URL where you get the rss-feed from." }
        ]
    },
    {
        "name": "rssOutput",
        "direction": "Out",
        "description": "Defines the content of the expected rss-feeds.",
        "properties": [
            {   "name": "title",        "type": "string", "description": "Headline of the feed item."},
            {   "name": "link",         "type": "url",    "description": "Link to the website of this feed item."},
            {   "name": "content",      "type": "string", "description": "The article/text itself."},
            {   "name": "author",       "type": "email",  "description": "The e-mail address of the author."},
            {   "name": "published",    "type": "date",   "description": "The date that the article was published."}
        ]
    }
];

module.exports.work = function(packages, callback) {

    console.log(packages.get("urlInfo"))

    async.map(packages.get("urlInfo"), readFeed, callback);

    function readFeed(itemOn, callback) {

        feedReader(itemOn.url, function (err, articles) {
            if (err) throw err;

            packages.add("rssOutput", articles);
            return callback();
        });
    }
}


