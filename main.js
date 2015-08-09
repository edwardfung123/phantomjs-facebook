var pprint = require('./tasks/_helpers.js').pprint;

function print_usage(){
  console.log([
    'Usage: phantomjs --config=config.json main.js -t TASK -u EMAIL -p PASSWORD -c COOKIE_JAR',
    '',
    '--------------------------------------------',
    '',
    '  -t TASK          :    TASK = login | friends | stories',
    '  -u EMAIL         :    your email',
    '  -p PASSWORD      :    your password',
    '  -c COOKIE_JAR    :    cookie jar in json format',
    '',
  ].join('\n'));
}

var system = require('system');
var args = require('./node_modules/minimist/index.js')(system.args.slice(1));
//phantom.exit();
var task = args.t, CookieJar = args.c, email = args.u, password = args.p;
if (!task || !CookieJar){
  console.error('Missing argument');
  print_usage();
  phantom.exit();
}

if (task == 'login' && (!email || !password)){
  console.error('Missing argument');
  print_usage();
  phantom.exit();
}

var page = require('webpage').create();

page.settings.userAgent = 'Mozilla/5.0 (compatible; MSIE 9.0; Windows Phone OS 7.5; Trident/5.0; IEMobile/9.0)';

page.onConsoleMessage = function(msg, lineNum, sourceId) {
  console.log('CONSOLE: ' + msg + ' (from line #' + lineNum + ' in "' + sourceId + '")');
};


page.onResourceError = function(resourceError) {
  page.reason = resourceError.errorString;
  page.reason_url = resourceError.url;
};


var tasks = require('./tasks/tasks.js');
if (task == 'login'){
  tasks.login.run(page, email, password, CookieJar, function(){
    console.log("completed");
    phantom.exit();
  });
} else if (task == 'stories'){
  var maxPages = 10;
  tasks.stories.run(page, CookieJar, maxPages, function(){
    console.log('completed');
    phantom.exit();
  });
} else if (task == 'friends'){
  tasks.friends.run(page, CookieJar, function(friends){
    console.log('completed');
    console.log(pprint(friends));
    phantom.exit();
  });
}

