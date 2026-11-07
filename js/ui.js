function el(tag, className = '', text = '') {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function getProfile() {
  return Pet.fromStorage(storage.get('profile'));
}

function preloadImage(url) {
  return new Promise((resolve, reject) => {
    const probe = new Image();
    probe.onload = () => resolve(url);
    probe.onerror = () => reject(new Error('Image failed to load'));
    probe.src = url;
  });
}

function currentTheme() {
  return document.documentElement.getAttribute('data-bs-theme') === 'dark' ? 'dark' : 'light';
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-bs-theme', theme);
  const button = document.getElementById('theme-toggle');
  if (!button) return;
  const dark = theme === 'dark';
  button.textContent = dark ? '☀️ Light' : '🌙 Dark';
  button.setAttribute('aria-pressed', String(dark));
}

function mountThemeToggle() {
  const list = document.querySelector('#menu .navbar-nav');
  if (!list) return;
  const item = el('li', 'nav-item ms-lg-2 mt-2 mt-lg-0');
  const button = el('button', 'btn btn-outline-pet btn-sm');
  button.type = 'button';
  button.id = 'theme-toggle';
  button.setAttribute('aria-label', 'Toggle dark theme');
  item.appendChild(button);
  list.appendChild(item);
  applyTheme(currentTheme());
  button.addEventListener('click', () => {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    storage.set('theme', next);
  });
}

function mountProfileStrip(page) {
  if (page === 'home') return;
  const pet = getProfile();
  const header = document.querySelector('.page-header');
  if (!pet || !header) return;
  const wrapper = el('div', 'container mt-3');
  const strip = el('div', 'profile-strip');
  const label = `🐾 ${pet.name} · ${pet.speciesLabel} · ${pet.age} y${pet.breed ? ' · ' + pet.breed : ''}`;
  const link = el('a', 'small', 'Edit profile');
  link.href = 'index.html#profile';
  strip.append(el('span', '', label), link);
  wrapper.appendChild(strip);
  header.after(wrapper);
}

function showToast(message, type = 'success') {
  let container = $('#toast-container');
  if (!container.length) {
    container = $('<div id="toast-container" role="status" aria-live="polite"></div>').appendTo('body');
  }
  $('<div class="toast-msg"></div>')
    .addClass(type === 'danger' ? 'danger' : '')
    .text(message)
    .hide()
    .appendTo(container)
    .fadeIn(200)
    .delay(2600)
    .fadeOut(400, function () {
      $(this).remove();
    });
}