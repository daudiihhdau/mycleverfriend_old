"use strict";

/**
 * Created by daudiihhdau on 17.12.15.
 */
var missionPlugin = require('../../../Lib/missionPlugin.js')
var feedReader = require("feed-read");

var urlInfoPackage = {
    name: "URLInfo",
    direction: "Input",
    description: "Defines the rss-feeds you like to subscribe for.",
    properties: {
        numFeedItems: { type: "integer",    description: "Numbers of feeds to store.",              defaultValue: 200},
        url:          { type: "url",        description: "URL where you get the rss-feed from." }
    }
};

var rssOutputPackage = {
    name: "RSSOutput",
    direction: "Output",
    description: "Defines the content of the expected rss-feeds.",
    properties: {
        guid:     { type: "string", description: ""},
        title:    { type: "string", description: "Headline of the feed item."},
        link:     { type: "url",    description: "Link to the website of this feed item."},
        content:  { type: "string", description: "The article/text itself."},
        author:   { type: "email",  description: "The e-mail address of the author."},
        published:{ type: "date",   description: "The date that the article was published."}
    }
};

module.exports.packageDefinitions = [urlInfoPackage, rssOutputPackage];

module.exports.work = function(callback) {

    async.map(missionPlugin.getItems(urlInfoPackage), readFeed, callback);

    function callbackTest(err, item, articles) {
        if (err) throw err;

        _.each(articles, function(articleOn) {
            missionPlugin.addItem(rssOutputPackage, articleOn);
        });
    }

    function readFeed(itemOn, callback) {
        feedReader(itemOn.url, function (err, articles) {
            if (err) throw err;

            callbackTest(null, itemOn, articles);
            callback();
        });
    }
}


