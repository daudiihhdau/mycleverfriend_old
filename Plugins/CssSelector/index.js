"use strict";

/**
 * Created by daudiihhdau on 17.12.15.
 */
var cheerio = require('cheerio');

module.exports.packageTypes = {
    input: {
        htmlCode: {
            description: "Defines the html source you, which you need to select elements.",
            properties: {
                sourceCode: { type: "string", description: "HTML Source Code" }
            }
        }
    },
    output: {
        selectedElements: {
            description: "Key Values of the selected element values",
            properties: {
                key: {   type: "url",       description: "URL where you get the html code from." },
                value: { type: "integer",   description: "Response Status Code" }
            }
        }
    }
};


module.exports.work = function(packages, callback) {

    async.map(packages.input["htmlcode"], selectElements, callback);

    function selectElements(itemOn, callback) {

        var $ = cheerio.load(itemOn.sourcecode);

        $("#spMainContent > div.schlagzeilen-content > div > h2 > a > span.headline").each(function() {

            var headline = $(this);

            packages.output['selectedelements'].push({ 'key': 'headline', 'value': headline.text() });
        });

        return callback(null, packages);
    }
}


