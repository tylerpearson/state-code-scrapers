var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

console.log("Staring scraping");

var allResults = [];


for (var chapter=1; chapter <= 168; chapter++) {

    (function(chapter) {
        var chapterURL = "http://www.ncleg.net/EnactedLegislation/Statutes/HTML/ByChapter/Chapter_" + chapter + ".html";

        // be nice and spread this out
        setTimeout(function() {
            request(chapterURL, function(error, response, html){
                if (!error) {
                    var $ = cheerio.load(html);
                    var title = $('.aChapter').text();
                    if (title.length) {
                        var chapter = title.split('.')[0].trim(),
                            name = title.split('.')[1].trim(),
                            results = {};

                        results.chapter = chapter;
                        results.name = name;

                        console.log(JSON.stringify(results));

                        allResults.push(allResults);
                        // console.log(chapter);
                        // console.log(name);
                    } else {
                        // console.log("No title for " + chapterURL);
                    }
                } else {
                    console.log("Error loading " + chapterURL);
                }
            })
        }, Math.random() * 20000);

    }(chapter));
}


