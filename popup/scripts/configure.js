
// get current config out of storage
document.onreadystatechange = function() {
  if (document.readyState === 'interactive') {
    var button = document.getElementById('saveConfiguration');
    button.addEventListener('click', saveChanges);
    loadData();
  }
};

function loadData() {
  var first = document.getElementById('FirstName'),
    last = document.getElementById('LastName'),
    email = document.getElementById('EmailAddress'),
    apiKey = document.getElementById('APIKey');

  chrome.storage.sync.get(['rg_user_email', 'rg_user_fname', 'rg_user_lname', 'rg_app_apikey'], function (items) {
    if (items.rg_user_email) {
      email.value = items.rg_user_email;
    }
    if (items.rg_user_fname) {
      first.value = items.rg_user_fname;
    }
    if (items.rg_user_lname) {
      last.value = items.rg_user_lname;
    }
    if (items.rg_app_apikey) {
      apiKey.value = items.rg_app_apikey;
    }
  });
}

function saveChanges() {

  var first = document.getElementById('FirstName'),
    last = document.getElementById('LastName'),
    email = document.getElementById('EmailAddress'),
    apiKey = document.getElementById('APIKey');

  var appData = {
    rg_user_email: email.value,
    rg_user_fname: first.value,
    rg_user_lname: last.value,
    rg_app_apikey: apiKey.value
  };

  // Save it using the Chrome extension storage API.
  chrome.storage.sync.set(appData, function () {
    location.href = 'main.html';
  });
}