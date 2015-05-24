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


// from get-chapter-list.js
var chapters = ["0001A","0001A","0001B","0001B","0001C","0001C","0001D","0001D","0001E","0001E","0001F","0001F","0002","0002","0003","0003","0004","0004","0005","0005","0005A","0005A","0006","0006","0007","0007","0007A","0007A","0007B","0007B","0008","0008","0008A","0008A","0008B","0008B","0008C","0008C","0009","0009","0010","0010","0010A","0010A","0010B","0010B","0011","0011","0012","0012","0013","0013","0014","0014","0015","0015","0015A","0015A","0015B","0015B","0015C","0015C","0016","0016","0017","0017","0017A","0017A","0017B","0017B","0017C","0017C","0017D","0017D","0017E","0017E","0018","0018","0018A","0018A","0018B","0018B","0018C","0018C","0019","0019","0019A","0019A","0020","0020","0021","0021","0022","0022","0022A","0022A","0022B","0022B","0022C","0022C","0023","0023","0024","0024","0025","0025","0025A","0025A","0025B","0025B","0025C","0025C","0026","0026","0027","0027","0028","0028","0028A","0028A","0028B","0028B","0028C","0028C","0029","0029","0030","0030","0031","0031","0031A","0031A","0031B","0031B","0031C","0031C","0032","0032","0032A","0032A","0033","0033","0033A","0033A","0033B","0033B","0034","0034","0035","0035","0035A","0035A","0036","0036","0036A","0036A","0036B","0036B","0036C","0036C","0036D","0036D","0036E","0036E","0037","0037","0037A","0037A","0038","0038","0038A","0038A","0038B","0038B","0039","0039","0039A","0039A","0040","0040","0040A","0040A","0041","0041","0041A","0041A","0042","0042","0042A","0042A","0043","0043","0044","0044","0044A","0044A","0045","0045","0045A","0045A","0046","0046","0047","0047","0047A","0047A","0047B","0047B","0047C","0047C","0047D","0047D","0047E","0047E","0047F","0047F","0047G","0047G","0047H","0047H","0048","0048","0048A","0048A","0049","0049","0049A","0049A","0050","0050","0050A","0050A","0050B","0050B","0050C","0050C","0051","0051","0052","0052","0052A","0052A","0052B","0052B","0052C","0052C","0053","0053","0053A","0053A","0053B","0053B","0053C","0053C","0054","0054","0054A","0054A","0054B","0054B","0054C","0054C","0055","0055","0055A","0055A","0055B","0055B","0055C","0055C","0055D","0055D","0056","0056","0057","0057","0057A","0057A","0057B","0057B","0057C","0057C","0057D","0057D","0058","0058","0058A","0058A","0059","0059","0059B","0059B","0060","0060","0061","0061","0062","0062","0062A","0062A","0063","0063","0063A","0063A","0064","0064","0065","0065","0066","0066","0067","0067","0068","0068","0069","0069","0070","0070","0071","0071","0071A","0071A","0072","0072","0073","0073","0074","0074","0074A","0074A","0074B","0074B","0074C","0074C","0074D","0074D","0074E","0074E","0074F","0074F","0074G","0074G","0075","0075","0075A","0075A","0075B","0075B","0075C","0075C","0075D","0075D","0075E","0075E","0076","0076","0076A","0076A","0077","0077","0078","0078","0078A","0078A","0078B","0078B","0078C","0078C","0078D","0078D","0079","0079","0080","0080","0081","0081","0081A","0081A","0082","0082","0083","0083","0083A","0083A","0084","0084","0084A","0084A","0085","0085","0085A","0085A","0085B","0085B","0085C","0085C","0086","0086","0086A","0086A","0087","0087","0088","0088","0088A","0088A","0088B","0088B","0089","0089","0089A","0089A","0089B","0089B","0089C","0089C","0089D","0089D","0089E","0089E","0089F","0089F","0089G","0089G","0090","0090","0090A","0090A","0090B","0090B","0090C","0090C","0090D","0090D","0091","0091","0091A","0091A","0092","0092","0093","0093","0093A","0093A","0093B","0093B","0093C","0093C","0093D","0093D","0093E","0093E","0094","0094","0095","0095","0096","0096","0097","0097","0098","0098","0099","0099","0099A","0099A","0099B","0099B","0099C","0099C","0099D","0099D","0099E","0099E","0100","0100","0101","0101","0102","0102","0103","0103","0104","0104","0104A","0104A","0104B","0104B","0104C","0104C","0104D","0104D","0104E","0104E","0104F","0104F","0104G","0104G","0105","0105","0105A","0105A","0105B","0105B","0106","0106","0107","0107","0108","0108","0108A","0108A","0108B","0108B","0108C","0108C","0108D","0108D","0109","0109","0110","0110","0111","0111","0112","0112","0113","0113","0113A","0113A","0113B","0113B","0114","0114","0115","0115","0115A","0115A","0115B","0115B","0115C","0115C","0115D","0115D","0115E","0115E","0116","0116","0116A","0116A","0116B","0116B","0116C","0116C","0116D","0116D","0116E","0116E","0117","0117","0118","0118","0118A","0118A","0118B","0118B","0119","0119","0120","0120","0120C","0120C","0121","0121","0122","0122","0122A","0122A","0122B","0122B","0122C","0122C","0122D","0122D","0122E","0122E","0123","0123","0123A","0123A","0124","0124","0125","0125","0126","0126","0127","0127","0127A","0127A","0127B","0127B","0127C","0127C","0128","0128","0129","0129","0130","0130","0130A","0130A","0130B","0130B","0131","0131","0131A","0131A","0131B","0131B","0131C","0131C","0131D","0131D","0131E","0131E","0131F","0131F","0132","0132","0133","0133","0134","0134","0134A","0134A","0135","0135","0136","0136","0137","0137","0138","0138","0138A","0138A","0139","0139","0140","0140","0140A","0140A","0141","0141","0142","0142","0143","0143","0143A","0143A","0143B","0143B","0143C","0143C","0143D","0143D","0144","0144","0145","0145","0146","0146","0147","0147","0148","0148","0149","0149","0150","0150","0150A","0150A","0150B","0150B","0151","0151","0152","0152","0152A","0152A","0153","0153","0153A","0153A","0153B","0153B","0153C","0153C","0154","0154","0155","0155","0156","0156","0157","0157","0157A","0157A","0158","0158","0159","0159","0159A","0159A","0159B","0159B","0159C","0159C","0159D","0159D","0159E","0159E","0159F","0159F","0159G","0159G","0159I","0159I","0160","0160","0160A","0160A","0160B","0160B","0160C","0160C","0161","0161","0162","0162","0162A","0162A","0162B","0162B","0163","0163","0164","0164","0165","0165","0166","0166","0166A","0166A","0167","0167","0168","0168","0168A","0168A"];



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


