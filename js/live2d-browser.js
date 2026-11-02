(function () {
  'use strict';
  if (window.blogLive2dToggleReady) return;
  window.blogLive2dToggleReady = true;

  var storageKey = 'yulin-blog:live2d-enabled';
  var enabled = false;
  try {
    enabled = window.localStorage.getItem(storageKey) === 'true';
  } catch (error) {
    // Browsers blocking storage keep Live2D hidden by default.
  }

  var button = document.createElement('button');
  button.id = 'live2d-browser-toggle';
  button.type = 'button';
  button.textContent = 'Live2D：' + (enabled ? '开' : '关');
  button.setAttribute('aria-pressed', String(enabled));
  button.title = '仅在当前浏览器记住选择，点击后刷新页面';
  button.addEventListener('click', function () {
    try {
      window.localStorage.setItem(storageKey, String(!enabled));
    } catch (error) {
      button.textContent = 'Live2D：无法保存';
      button.title = '请允许此网站保存浏览器数据后重试';
      return;
    }
    window.location.reload();
  });

  function mountButton() {
    if (!document.getElementById(button.id)) document.body.appendChild(button);
  }
  mountButton();
  document.addEventListener('pjax:complete', mountButton);

  if (!enabled) return;

  var config = window.blogLive2dConfig;
  if (!config) return;
  var script = document.createElement('script');
  script.src = config.cdn;
  script.async = true;
  function showError() {
    button.textContent = 'Live2D：加载失败';
    button.title = '刷新页面重试，或点击关闭当前浏览器的 Live2D';
  }
  script.onerror = showError;
  script.onload = function () {
    try {
      window.oml2d = window.OML2D.loadOml2d(config.options);
    } catch (error) {
      showError();
    }
  };
  document.head.appendChild(script);
})();
