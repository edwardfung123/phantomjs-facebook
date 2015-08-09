var helpers = require('./_helpers.js');

function login(page, email, password, CookieJar, cb){
  cb = cb || function(){};
  helpers.setCookie(page, CookieJar);

  page.onLoadFinished = function(status){
    console.log(status);
    console.log(page.url);
    if (page.url == 'https://m.facebook.com/'){
      var requireLogin = page.evaluate(function(){
        var form = document.getElementById("login_form");
        return !!form;
      });
      if (requireLogin){
        console.log('need login');
        page.evaluate(fillLoginInfo, email, password);
        return;
      } else {
        console.log('logged in');
        // logged in
        page.render('./screens/home.png');
        // Check friends.
        //page.open('https://m.facebook.com/friends/center/friends/');
      }
    }

    cb();
  }

  page.open('https://m.facebook.com');
}

var fillLoginInfo = function(email, password){
  //console.log('login info: email = ' + email + ', password = ' + password);
  var frm = document.getElementById("login_form");

  frm.elements["email"].value = email;
  frm.elements["pass"].value = password;
  frm.submit();
}

module.exports = {
  run: login,
};
