var helpers = require('./_helpers.js');

function stories(page, CookieJar, maxPages, cb){
  cb = cb || function(){};
  helpers.setCookie(page, CookieJar);

  var nPage = 1;
  page.onLoadFinished = function(status){
    console.log(status);
    console.log(page.url);
    if (page.url.indexOf('https://m.facebook.com/stories.php') == 0){
      console.log('loaded the ' + nPage);
      page.render('./screens/' + nPage + '.png');
      nPage++;
      if (nPage < maxPages){
        // find the next stories url
        var url = page.evaluate(function(){
          var a = document.querySelector('a[href^="/stories.php"]');
          if (a){
            return a.href;
          }
          return '';
        });
        if (url){
          page.open(url);
          return;
        }
      } else {
       cb();
      }
    }
  }

  page.open('https://m.facebook.com/stories.php');
}

module.exports = {
  run: stories,
};
