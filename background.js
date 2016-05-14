
var whitelistDomains = [],
  userData = {},
  apiKey;

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

function loadUserData() {
  // check if we have user details to set raygun user
  chrome.storage.sync.get(['rg_user_email', 'rg_user_fname', 'rg_user_lname', 'rg_user_id', 'rg_app_apikey'], function (items) {
    var uid = items.rg_user_id,
      email = items.rg_user_email,
      first = items.rg_user_fname,
      last = items.rg_user_lname;

    apiKey = items.rg_app_apikey;

    if (uid) {
      if (items.rg_user_email) {
        // we know who the user is
        userData = {
          uid: uid,
          isAnonymous: false,
          email: email,
          firstName: first,
          fullName: first + ' ' + last
        }
      } else {
        // anonymous but we should have a uuid
        userData = {
          uid: uid,
          isAnonymous: false,
          email: '',
          firstName: 'Chrome',
          fullName: 'Extension'
        }
      }
    }
  });
}

function ensureUserId() {
  chrome.storage.sync.get(['rg_user_id'], function (items) {
    var id = items.rg_user_id;
    if (!id) {
      id = getId();
      chrome.storage.sync.set({ rg_user_id: id });
    }
  });
}


function attachRaygun(url, tabId) {
  if (apiKey && isUrlMatchToWhitelist(url)) {
    chrome.tabs.executeScript(tabId, { file: 'raygun.min.js', runAt: 'document_start' }, function () {
      var code = [
          'var rg4chrome = Raygun.init("' + apiKey + '", { disablePulse: false, debugMode: true, apiUrl: "https://api.raygun.com", from: "onLoad" });',
          'rg4chrome.attach();',
          'rg4chrome.setUser("' + userData.uid + '", ' + userData.isAnonymous + ', "' + userData.email + '", "' + userData.firstName + '", "' + userData.fullName + '", "' + userData.uid + '");'
      ];

      chrome.tabs.executeScript(tabId, {
        code: code.join('\n'),
        runAt: 'document_idle'
      });
    });
  }
}

function injectRaygun(url, tabId) {
  if (apiKey && isUrlMatchToWhitelist(url)) {

    // injection code for raygun library
    var injectLibraryLines = [
      'var elt = document.createElement("script");',
      'elt.type = "text/javascript";',
      'elt.src = "' + chrome.extension.getURL('raygun.min.js') + '"',
      'document.getElementsByTagName("head")[0].appendChild(elt);'
    ];

    chrome.tabs.executeScript(tabId, {
        code: injectLibraryLines.join('\n'),
        runAt: 'document_start'
      },
      function() {
        var initCodeLines = [
          'var rg4chrome = Raygun.init("' + apiKey + '", { disablePulse: false, debugMode: true, apiUrl: "https://api.raygun.com", from: "onLoad" });',
          'rg4chrome.attach();',
          'rg4chrome.setUser("' + userData.uid + '", ' + userData.isAnonymous + ', "' + userData.email + '", "' + userData.firstName + '", "' + userData.fullName + '", "' + userData.uid + '");'
        ];

        // injection code for raygun initialise
        var code = [
          'var elt = document.createElement("script");',
          'elt.type = "text/javascript";',
          'elt.textContent = \'' + initCodeLines.join('') + '\'',
          'document.getElementsByTagName("body")[0].appendChild(elt);'
        ];

        chrome.tabs.executeScript(tabId, {
          code: code.join('\n'),
          runAt: 'document_idle'
        });
      }
    );
  }
}

// on install/update of plugin set an ID for the user if not already set
chrome.runtime.onInstalled.addListener(function () {
  ensureUserId();
  loadWhitelistedDomains();
  loadUserData();
});

// listen for when the whitelist is changed
chrome.runtime.onMessage.addListener(function (message) {
  if (message === 'reloadWhitelist') {
    loadWhitelistedDomains();
  }
  else if (message === 'reloadConfiguration') {
    loadUserData();
  }
});

// wire up injection into tab changes
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status && changeInfo.url && changeInfo.status === 'loading') {
    injectRaygun(changeInfo.url, tabId);
    //attachRaygun(changeInfo.url, tabId);
  }
});