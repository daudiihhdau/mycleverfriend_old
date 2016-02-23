"use strict";

/**
 * Created by daudiihhdau on 17.12.15.
 */
var feedReader = require("feed-read");

module.exports.packageDefinitions = {
    "URLInfo": {
        direction: "In",
        description: "Defines the rss-feeds you like to subscribe for.",
        properties: {
            numFeedItems: { type: "integer",    description: "Numbers of feeds to store.",              defaultValue: 200},
            url:          { type: "url",        description: "URL where you get the rss-feed from." }
        }
    },
    "RSSOutput": {
        direction: "Out",
        description: "Defines the content of the expected rss-feeds.",
        properties: {
            title:    { type: "string", description: "Headline of the feed item."},
            link:     { type: "url",    description: "Link to the website of this feed item."},
            content:  { type: "string", description: "The article/text itself."},
            author:   { type: "email",  description: "The e-mail address of the author."},
            published:{ type: "date",   description: "The date that the article was published."}
        }
    }
};

module.exports.work = function(packages, callback) {

    /*
    // dreamworld: get all documents
    async.map(, readFeed, callback);
    // dreamworld: add new document
    newRow = packages.getTemplate("URLInfo");
    // dreamworld: add new document
    packages.add("RSSOutput", newRow);
    */

    //async.map(missionPlugin.getItems(urlInfoPackage), readFeed, callback);
    async.map(packages.get("URLInfo"), readFeed, callback);

    function saveArticles(err, item, articles) {
        if (err) throw err;

        _.each(articles, function(articleOn) {
            packages.add("RSSOutput", articleOn);
        });
    }

    function readFeed(itemOn, callback) {
        feedReader(itemOn.url, function (err, articles) {
            if (err) throw err;

            saveArticles(null, itemOn, articles);
            return callback();
        });
    }
}


