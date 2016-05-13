
document.onreadystatechange = function () {
  if (document.readyState === 'interactive') {
    var button = document.getElementById('CreateAccountButton');
    button.addEventListener('click', createAccount);
  }
};

function createAccount() {
  var first = document.getElementById('FirstName'),
    last = document.getElementById('LastName'),
    email = document.getElementById('EmailAddress');

  var appData = {
    rg_user_email: email.value,
    rg_user_fname: first.value,
    rg_user_lname: last.value,
    rg_app_apikey: 'UYzfZmWyRcx6wVmXJRGSEA=='
  };

  // Save it using the Chrome extension storage API.
  chrome.storage.sync.set(appData, function () {
    // notify the background js of the user data change
    chrome.runtime.sendMessage('reloadConfiguration');

    location.href = 'main.html';
  });
}