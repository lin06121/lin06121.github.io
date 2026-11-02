(function () {
  'use strict';
  if (window.blogLive2dToggleReady) return;
  window.blogLive2dToggleReady = true;

  var tokenKey = 'yulin-blog:live2d-auth-token';
  var authUrl = 'http://127.0.0.1:8787/api/live2d/verify';

  function loadLive2d() {
    var config = window.blogLive2dConfig;
    if (!config) return;

    var script = document.createElement('script');
    script.src = config.cdn;
    script.async = true;
    script.onload = function () {
      try {
        window.oml2d = window.OML2D.loadOml2d(config.options);
      } catch (error) {
        console.error('Live2D initialization failed.', error);
      }
    };
    document.head.appendChild(script);
  }

  try {
    var token = window.localStorage.getItem(tokenKey);
    if (!token) return;

    fetch(authUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: token })
    })
      .then(function (response) { return response.json(); })
      .then(function (result) {
        if (result.authorized === true) loadLive2d();
        else window.localStorage.removeItem(tokenKey);
      })
      .catch(function () {
        // Keep Live2D hidden when the local authorization service is unavailable.
      });
  } catch (error) {
    // Browsers blocking storage keep Live2D hidden.
  }
})();
