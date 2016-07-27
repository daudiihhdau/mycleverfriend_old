"use strict";

/**
 * Created by daudiihhdau on 17.12.15.
 */
var request = require("request");

module.exports.packageTypes = {
    input: {
        urlinfo: {
            description: "Defines the url of the website, you like to download.",
            properties: {
                url:          { type: "url",    description: "URL where you get the rss-feed from." }
            }
        }
    },
    output: {
        downloadInfo: {
            description: "Defines the content of the expected url.",
            properties: {
                url:            { type:   "url",        description: "URL where you get the html code from." },
                status:         { type:   "integer",    description: "Response Status Code" },
                contentType:   {  type:    "string",    description: "Header Response Content Type" },
                sourceCode:     { type:   "string",     description: "HTML Source Code" }
            }
        }
    }
};

module.exports.work = function(packages, callback) {

    async.map(packages.input['urlinfo'], downloadWebsite, callback);

    function downloadWebsite(itemOn, callback) {

        request(itemOn.url, function(error, response, body) {
            if (error) throw error;

            packages.output['downloadinfo'].push({ 'url': itemOn.url, 'status': response.statusCode, 'contentType': response.headers['content-type'], 'sourceCode': body });

            return callback(error, packages);
        });
    }
}


