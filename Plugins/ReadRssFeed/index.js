"use strict";

/**
 * Created by daudiihhdau on 17.12.15.
 */
var feedReader = require("feed-read");

module.exports.packageTypes = {
    input: {
        urlinfo: {
            description: "Defines the rss-feeds you like to subscribe for.",
            properties: {
                numFeedItems: { type: "integer",    description: "Numbers of feeds to store.",              defaultValue: 200},
                url:          { type: "url",        description: "URL where you get the rss-feed from." }
            }
        }
    },
    output: {
        rssoutput: {
            description: "Defines the content of the expected rss-feeds.",
            properties: {
                title:    { type: "string", description: "Headline of the feed item."},
                link:     { type: "url",    description: "Link to the website of this feed item."},
                content:  { type: "string", description: "The article/text itself."},
                author:   { type: "email",  description: "The e-mail address of the author."},
                published:{ type: "date",   description: "The date that the article was published."}
            }
        }
    }
};

module.exports.work = function(packages, callback) {

    async.map(packages.input['urlinfo'], readFeed, callback);

    function readFeed(itemOn, callback) {

        feedReader(itemOn.url, function (err, articles) {
            if (err) throw err;

            _.each(articles, function (articleOn) {
                packages.output['rssoutput'].push(articleOn);
            });

            return callback(err, packages);
        });
    }
}


