"use strict";

/**
 * Created by daudiihhdau on 17.12.15.
 */
var request = require("request");

module.exports.packageDefinitions = {
    urlInfo: {
        direction: "In",
        description: "Defines the url of the website, you like to download.",
        properties: {
            url:    { type: "url",  description: "URL where you get the html code from." }
        }
    },
    htmlOutput: {
        direction: "Out",
        description: "WebseitenContent",
        properties: {
            url:    { type:   "url",      description: "URL where you get the html code from." },
            status: { type: "integer",    description: "Response Status Code" },
            html:   { type:   "string",   description: "HTML Source Code" }
        }
    }
};

module.exports.work = function(packages, callback) {

    async.map(packages.get("urlinfo"), readHTMLSource, callback);

    function readHTMLSource(itemOn, callback) {

        request(itemOn.url, function(error, response, body) {
            if (error) throw error;

            packages.add("htmloutput", { 'url': itemOn.url, 'status': response.statusCode, 'html': body });
            return callback();
        });
    }
}


