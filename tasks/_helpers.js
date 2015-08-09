var pageResponses = {};

var fs = require('fs');
function setCookie(page, CookieJar){
  page.onResourceReceived = function(response) {
    pageResponses[response.url] = response.status;
    fs.write(CookieJar, JSON.stringify(phantom.cookies), "w");
  };

  if(fs.isFile(CookieJar)){
    Array.prototype.forEach.call(JSON.parse(fs.read(CookieJar)), function(x){
      phantom.addCookie(x);
    });
  }
}

function pprint(obj){
  return JSON.stringify(obj, null, 2);
}

module.exports = {
  setCookie: setCookie,
  pprint: pprint,
};
