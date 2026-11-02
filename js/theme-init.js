(function () {
  let theme = 'light';
  try {
    const saved = JSON.parse(localStorage.getItem('petcare_theme'));
    if (saved === 'dark' || saved === 'light') theme = saved;
  } catch (error) {}
  document.documentElement.setAttribute('data-bs-theme', theme);
})();