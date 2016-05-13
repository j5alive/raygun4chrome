

//'var rg4chrome = Raygun.constructNewRaygun();',

//var codeArray = [
//  'var rg4chrome = Raygun.init("UYzfZmWyRcx6wVmXJRGSEA==", { disablePulse: false, debugMode: true, apiUrl: "https://api.raygun.com", from: "onLoad" });',
//  'rg4chrome.attach();'
//];

//var actualCode = '(' + function () {
//  // All code is executed in a local scope.
//  var rg4chrome = Raygun.init("UYzfZmWyRcx6wVmXJRGSEA==", { disablePulse: false, debugMode: true, apiUrl: "https://api.raygun.com", from: "onLoad" });
//  rg4chrome.attach();
//  chrome.storage.sync.get(['rg_user_email', 'rg_user_fname', 'rg_user_lname', 'rg_user_id'], function (items) {
//    var uid = items.rg_user_id,
//      email = items.rg_user_email,
//      first = items.rg_user_fname,
//      last = items.rg_user_lname;

//    if (uid) {
//      if (items.rg_user_email) {
//        // we know who the user is
//        rg4chrome.setUser(uid, false, email, first, first + ' ' + last, uid);
//      } else {
//        // anonymous but we should have a uuid
//        rg4chrome.setUser(uid, true, '', '', '', uid);
//      }
//    }
//  });
//} + ')();';


//var elt = document.createElement("script");
//elt.type = "text/javascript";
////elt.textContent = codeArray.join('\n');
//elt.textContent = actualCode;
//document.getElementsByTagName("body")[0].appendChild(elt);


    //var rg4chrome = Raygun.constructNewRaygun();
    //rg4chrome.init('UYzfZmWyRcx6wVmXJRGSEA==', { disablePulse: false, debugMode: true }).attach();

//rg4js('apiKey', 'UYzfZmWyRcx6wVmXJRGSEA==');
//rg4js('enableCrashReporting', true);
//rg4js('enablePulse', true);

//document.onreadystatechange = function () {
//  if (document.readyState == "interactive") {
//    var s = document.createElement('script');
//    s.src = chrome.extension.getURL('raygun.min.js');
//    s.onload = function () {
//      this.parentNode.removeChild(this);
//    };
//    (document.head || document.documentElement).appendChild(s);
//  }

//  if (document.readyState == "complete") {
//    Raygun.init("UYzfZmWyRcx6wVmXJRGSEA==", { disablePulse: false, debugMode: true }).attach();
//  }
//}

