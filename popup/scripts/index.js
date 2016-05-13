
document.onreadystatechange = function () {
  if (document.readyState === 'interactive') {
    chrome.storage.sync.get(['rg_app_apikey'], function (items) {
      if (items.rg_app_apikey) {
        // have an API key configured, redirect to main page
        location.href = 'main.html';
      }
    });
  }
};