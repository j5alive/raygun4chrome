
function getId() {
  var randomPool = new Uint8Array(4);
  crypto.getRandomValues(randomPool);
  var hex = '';
  for (var i = 0; i < randomPool.length; ++i) {
    hex += randomPool[i].toString(16);
  }
  return hex;
}

function extractDomain(url) {
  var domain;
  //find & remove protocol (http, ftp, etc.) and get domain
  if (url.indexOf("://") > -1) {
    domain = url.split('/')[2];
  }
  else {
    domain = url.split('/')[0];
  }

  //find & remove port number
  domain = domain.split(':')[0];

  return domain.toLowerCase();
}

var whitelistDomains = [];

function isUrlMatchToWhitelist(url) {
  var domain = extractDomain(url);
  return whitelistDomains.includes(domain);
}


function loadWhitelistedDomains() {
  chrome.storage.sync.get(['rg_app_domains'], function (items) {
    if (items.rg_app_domains) {
      var domains = JSON.parse(items.rg_app_domains);
      whitelistDomains = domains;
    }
  });
}

// on install/update of plugin set a ID for the user if not already set
chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.get(['rg_user_id'], function (items) {
    var id = items.rg_user_id;
    if (!id) {
      id = getId();
      chrome.storage.sync.set({ rg_user_id: id });
    }
  });

  loadWhitelistedDomains();
});


chrome.runtime.onMessage.addListener(function (message, sender) {
  if (message === 'reloadWhitelist') {
    loadWhitelistedDomains();
  }
});


chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status && changeInfo.url && changeInfo.status === 'loading') {
    if (isUrlMatchToWhitelist(changeInfo.url)) {

      var innerCode = [
        'var rg4chrome = Raygun.init("UYzfZmWyRcx6wVmXJRGSEA==", { disablePulse: false, debugMode: true, apiUrl: "https://api.raygun.com", from: "onLoad" });',
        'rg4chrome.attach();'
      ];

      chrome.storage.sync.get(['rg_user_email', 'rg_user_fname', 'rg_user_lname', 'rg_user_id'], function (items) {
        var uid = items.rg_user_id,
          email = items.rg_user_email,
          first = items.rg_user_fname,
          full = first + ' ' + items.rg_user_lname;

        if (uid) {
          if (items.rg_user_email) {
            // we know who the user is
            innerCode.push('rg4chrome.setUser("' + uid + '", false, "' + email + '", "' + first + '", "' + full + '", "' + uid + '");');
          } else {
            // anonymous but we should have a uuid
            innerCode.push('rg4chrome.setUser("' + uid + '", true, "", "Chrome", "", "' + uid + '");');
          }
        }

        var code = [
          'var elt = document.createElement("script");',
          'elt.type = "text/javascript";',
          'elt.textContent = \'' + innerCode.join('') + '\'',
          'document.getElementsByTagName("body")[0].appendChild(elt);'
        ];

        chrome.tabs.executeScript(tabId, {
          code: code.join('\n'),
          runAt: 'document_idle'
        });
      });
    }
  }
});


//chrome.extension.onRequest.addListener(function (request, sender, callback) {
//  var tabId = request.tabId;
//  chrome.tabs.executeScript(tabId, { file: "content.js" }, function () {
//    chrome.tabs.sendRequest(tabId, {}, function (results) {
//      validateLinks(results, callback);
//    });
//  });
//});