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
                url:            { type:   "url",       description: "URL where you get the html code from." },
                status:         { type:   "integer",   description: "Response Status Code" },
                contentType:    { type:   "string",    description: "Header Response Content Type" },
                sourceCode:     { type:   "string",    description: "HTML Source Code" }
            }
        }
    }
};

module.exports.work = function(packages, callback) {

    async.map(packages.input['urlinfo'], downloadWebsite, callback);

    function downloadWebsite(itemOn, callback) {

        request(itemOn.url, function(error, response, body) {
            if (error) throw error;

            var downloadedContent = { 'url': itemOn.url, 'status': response.statusCode, 'contentType': response.headers['content-type'], 'sourceCode': body };

            if (response.headers['content-type'].includes("json")){
                // merge json to output package
                downloadedContent = _.extend(downloadedContent, JSON.parse(body));
            }

            packages.output['downloadinfo'].push(downloadedContent);

            return callback(error, packages);
        });
    }
}


