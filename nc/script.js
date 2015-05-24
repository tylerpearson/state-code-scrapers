var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');

var Entities = require('html-entities').AllHtmlEntities;
entities = new Entities();

console.log("Starting scraping");

var allResults = [];

function cleanLineBreaks(text) {
    var text = text.replace(/(\r\n|\n|\r)/gm, " ");
    text = text.replace(/\s+/g, ' ');
    return text;
}

for (var chapter=1; chapter <= 168; chapter++) {

    (function(chapter) {
        // add in check for A, B, C, D, etc
        // http://www.ncga.state.nc.us/EnactedLegislation/Statutes/HTML/ByChapter/Chapter_143D.html
        // or just grab this from http://www.ncga.state.nc.us/gascripts/statutes/statutestoc.pl
        var chapterURL = "http://www.ncleg.net/EnactedLegislation/Statutes/HTML/ByChapter/Chapter_" + chapter +".html";

        // be nice and spread this out
        setTimeout(function() {
            request({url: chapterURL, encoding: null}, function(error, response, html){
                if (!error) {
                    var $ = cheerio.load(iconv.decode(html, 'iso-8859-1'));
                    var title = $('.aChapter').text();
                    if (title.length) {
                        var chapter = title.split('.')[0].trim(),
                            name = title.split('.')[1].trim().replace('\r\n', ' | '),
                            results = {};

                        results.chapter = chapter;
                        results.id = chapter.split(' ')[1];
                        results.name = name;

                        results.articles = [];

                        $('.aArticle').each(function(i, article) {
                            var $article = $(article),
                                articleName = $article.text(),
                                article = {};

                            article.chapter = articleName;
                            article.id = articleName.replace(/\D/g, '');
                            article.name = cleanLineBreaks($article.next().text());
                            article.statutes = [];

                            $article.nextAll('.aSection').each(function(i, elem) {
                                var $elem = $(elem);

                                var statuteInfo = {};
                                statuteInfo.name = cleanLineBreaks($elem.text());
                                statuteInfo.content = [];

                                $elem.nextUntil('.aSection').each(function(i, content) {
                                    (function(content, statuteInfo){
                                        $content = cleanLineBreaks($(content).text());
                                        if ($content.length > 1) {
                                            statuteInfo.content.push($content);
                                        }
                                    }(content, statuteInfo));
                                })


                                article.statutes.push(statuteInfo);
                            });


                            results.articles.push(article);
                        });

                        allResults.push(results);
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


