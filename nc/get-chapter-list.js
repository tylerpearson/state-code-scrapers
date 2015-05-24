var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');

// #mainBody tr+ tr a

var chapters = [];

request({url: "http://www.ncga.state.nc.us/gascripts/statutes/statutestoc.pl", encoding: null}, function(error, response, html){

    var $ = cheerio.load(iconv.decode(html, 'iso-8859-1'));

    $('#mainBody tr+ tr a').each(function(i, chapter) {
        var chapterId = $(chapter).attr('href').split('=')[1]
        console.log(chapterId);
        chapters.push(chapterId)
    });

    console.log(JSON.stringify(chapters));

});



