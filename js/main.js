document.addEventListener('DOMContentLoaded', () => {
  mountThemeToggle();
  mountProfileStrip(document.body.dataset.page);
  if (typeof pageInit === 'function') pageInit();
});