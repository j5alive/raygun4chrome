
//var elt = document.createElement('script');
//elt.type = 'text/javascript';
//elt.src = chrome.extension.getURL('raygun.min.js');
//document.getElementsByTagName('head')[0].appendChild(elt);

//document.onreadystatechange = function () {
//  if (document.readyState == "interactive") {

//    var url = chrome.extension.getURL('raygun.min.js');
//    !function(a,b,c,d,e,f,g,h){a.RaygunObject=e,a[e]=a[e]||function(){
//    (a[e].o=a[e].o||[]).push(arguments)},f=b.createElement(c),g=b.getElementsByTagName(c)[0],
//    f.async=1,f.src=d,g.parentNode.insertBefore(f,g),h=a.onerror,a.onerror=function(b,c,d,f,g){
//    h&&h(b,c,d,f,g),g||(g=new Error(b)),a[e].q=a[e].q||[],a[e].q.push({
//    e:g})}}(window,document,"script",url,"rg4js");
//  }

//  if (document.readyState == "complete") {
//    rg4js('apiKey', 'UYzfZmWyRcx6wVmXJRGSEA==');
//    rg4js('enableCrashReporting', true);
//    rg4js('enablePulse', true);
//  }
//}

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

