//'var rg4chrome = Raygun.constructNewRaygun();',

var code = [
  'var rg4chrome = Raygun.init("UYzfZmWyRcx6wVmXJRGSEA==", { disablePulse: false, debugMode: true, apiUrl: "https://api.raygun.com", from: "onLoad" });',
  'rg4chrome.attach();'
].join('\n');

var elt = document.createElement("script");
elt.type = "text/javascript";
elt.textContent = code;
document.getElementsByTagName("body")[0].appendChild(elt);

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

