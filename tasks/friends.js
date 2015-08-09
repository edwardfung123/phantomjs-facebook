var helpers = require('./_helpers.js');
var pprint = helpers.pprint;

var getFriendsFromPage = function(){
  var container = document.getElementById('friends_center_main');
  if (container){
    var tables = container.querySelectorAll('table.l');
    var friends = Array.prototype.map.call(tables, function(t, i){
      var img = t.querySelector('img');
      var a = t.querySelector('a.br');

      var name = img.alt;
      var parts = a.href.slice(a.href.indexOf('?') + 1).split('&');
      //console.log(parts);
      var fb_id = '';
      parts.forEach(function(p){
        if (p.indexOf('uid') != -1){
          fb_id = p.slice( p.indexOf('=') + 1 );
        }
      });

      var thumbnail = img.src;
      return {
        name: name,
        fb_id: fb_id,
        thumbnail: thumbnail,
      };
    });
    return friends;
  }
  return null;
};

var allFriends = []
function friends(page, CookieJar, cb){
  cb = cb || function(){};
  helpers.setCookie(page, CookieJar);

  page.onLoadFinished = function(status){
    console.log(status);
    console.log(page.url);
    if (page.url.indexOf('https://m.facebook.com/friends/center/friends') == 0){
      // get all the friends.
      var friends = page.evaluate(getFriendsFromPage);
      if (friends){
        console.log(pprint(friends));
        allFriends = allFriends.concat(friends);
        // find the next page
        var url = page.evaluate(function(){
          var a = document.querySelector('#friends_center_main a[href^="/friends/center/friends/"]');
          if (a){
            return a.href;
          }
          return '';
        });
        console.log('url = ' + url);
        if (url){
          page.open(url);
          return;
        } else {
          cb(allFriends);
        }
      } else {
        cb(allFriends);
      }
    }
  }

  page.open('https://m.facebook.com/friends/center/friends/')
}

module.exports = {
  run: friends,
};
