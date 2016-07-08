"use strict";

/**
 * Created by daudiihhdau on 17.12.15.
 */
var cheerio = require('cheerio');

module.exports.packageDefinitions = {
    htmlCode: {
        direction: "In",
        description: "Defines the html source you, which you need to select elements.",
        properties: {
            html: { type: "string", description: "HTML Source Code" }
        }
    },
    selectedElements: {
        direction: "Out",
        description: "Key Values of the selected element values",
        properties: {
            key: { type: "url", description: "URL where you get the html code from." },
            value: { type: "integer", description: "Response Status Code" }
        }
    }
};

module.exports.work = function(packages, callback) {


    async.map(packages.get("htmlCode"), readHTMLSource, callback);

    function readHTMLSource(itemOn, callback) {

        var $ = cheerio.load(itemOn.html)

        $(".entry-title > a").each(function() {

            var link = $(this);

            packages.add("selectedElements", { 'key': link.text(), 'value': link.attr("href") });
        });



        /*request(itemOn.url, function(error, response, body) {
            if (error) throw error;


            return callback();
        });*/
    }
}


