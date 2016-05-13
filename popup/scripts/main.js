
// get current config out of storage
document.onreadystatechange = function () {
  if (document.readyState === 'interactive') {

    var addButton = document.getElementById('AddCurrentDomain');
    addButton.addEventListener('click', addCurrentDomain);

    var removeButton = document.getElementById('RemoveCurrentDomain');
    removeButton.addEventListener('click', removeCurrentDomain);

    var resetLink = document.getElementById('ResetSettings');
    resetLink.addEventListener('click', resetSettings);

    loadData();
  }
};

var whitelistDomains = [];

function loadData() {
  var name = document.getElementById('UserName'),
    email = document.getElementById('UserEmail'),
    apiKey = document.getElementById('AppAPIKey');

  chrome.storage.sync.get(['rg_user_email', 'rg_user_fname', 'rg_user_lname', 'rg_app_apikey', 'rg_app_domains'], function (items) {
    if (items.rg_user_email) {
      email.innerText = items.rg_user_email;
    }
    if (items.rg_user_fname) {
      name.innerText = items.rg_user_fname;
    }
    if (items.rg_user_lname) {
      name.innerText += " " + items.rg_user_lname;
    }
    if (items.rg_app_apikey) {
      apiKey.innerText = items.rg_app_apikey;
    }
    if (items.rg_app_domains) {
      var domains = JSON.parse(items.rg_app_domains);

      whitelistDomains = domains;
      renderListOfDomains();
    }
  });
}

function renderListOfDomains() {
  var displayedWhitelist = document.getElementById('Domains'),
    whitelist = '';

  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    var currentTab = tabs[0],
      currentDomain = extractDomain(currentTab.url);

    whitelistDomains.forEach(function (domain) {
      if (domain === currentDomain) {
        whitelist += '<strong>' + domain + '</strong><br/>';
      } else {
        whitelist += domain + '<br/>';
      }
    });

    displayedWhitelist.innerHTML = whitelist;
  });
}

function addCurrentDomain() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var currentTab = tabs[0],
      domain = extractDomain(currentTab.url);

    if (!whitelistDomains.includes(domain)) {
      whitelistDomains.push(domain);
      renderListOfDomains();
      saveWhitelistDomains();
    }
  });
}

function removeCurrentDomain() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var currentTab = tabs[0],
      domain = extractDomain(currentTab.url);

    if (whitelistDomains.includes(domain)) {
      whitelistDomains.splice(whitelistDomains.indexOf(domain), 1);
      renderListOfDomains();
      saveWhitelistDomains();
    }
  });
}

function saveWhitelistDomains() {
  var domains = JSON.stringify(whitelistDomains);
  chrome.storage.sync.set({ rg_app_domains: domains }, function() {
    // notify the background js of the whitelist change
    chrome.runtime.sendMessage('reloadWhitelist');
  });
}

function resetSettings() {
  var emptySettings = {
    rg_app_domains: '',
    rg_user_email: '',
    rg_user_fname: '',
    rg_user_lname: '',
    rg_app_apikey: ''
  };
  chrome.storage.sync.set(emptySettings, function () {
    // notify the background js of the whitelist change
    chrome.runtime.sendMessage('reloadWhitelist');
    location.href = 'index.html';
  });
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
