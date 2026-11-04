function filterPets(pets, filters, favorites) {
  return pets.filter(pet => {
    const matchesQuery = filters.query.trim() === '' || pet.matchesQuery(filters.query);
    const matchesSpecies = filters.species === 'all' || pet.species === filters.species;
    const matchesAge = filters.age === 'all' || pet.ageGroup() === filters.age;
    const matchesFavorite = !filters.favOnly || favorites.includes(pet.id);
    return matchesQuery && matchesSpecies && matchesAge && matchesFavorite;
  });
}

function sortPets(pets, mode) {
  const sorters = {
    'name-asc': (a, b) => a.name.localeCompare(b.name),
    'name-desc': (a, b) => b.name.localeCompare(a.name),
    'age-asc': (a, b) => a.age - b.age,
    'age-desc': (a, b) => b.age - a.age
  };
  return [...pets].sort(sorters[mode] || sorters['name-asc']);
}

function updateFavoriteButton(button, isFavorite, petName) {
  button.textContent = isFavorite ? '♥' : '♡';
  button.setAttribute('aria-pressed', String(isFavorite));
  button.setAttribute('aria-label', `${isFavorite ? 'Remove' : 'Add'} ${petName} ${isFavorite ? 'from' : 'to'} favorites`);
  button.closest('.card-pet').classList.toggle('is-fav', isFavorite);
}

function createPetCard(pet, isFavorite) {
  const card = el('article', 'card-pet pet-card');
  card.dataset.id = pet.id;
  const action = pet.isAvailable()
    ? `<a href="#readiness" class="btn btn-pet btn-sm adopt-btn" data-id="${pet.id}">Adopt Me</a>`
    : '<span class="btn btn-secondary btn-sm disabled">Reserved</span>';
  card.innerHTML = `
    <img src="${pet.image}" class="img-fluid rounded-3 mb-3" alt="Shelter ${pet.species} ${pet.name}" loading="lazy">
    <div class="d-flex justify-content-between align-items-start">
      <h2 class="h5">${pet.name}</h2>
      <button type="button" class="fav-btn" data-id="${pet.id}"></button>
    </div>
    <p class="small">${pet.describe()}</p>
    <p class="small mb-2"><span class="badge-pet">${pet.size}</span> <span class="badge-pet">${pet.status}</span></p>
    ${action}`;
  card.querySelector('img').addEventListener('error', event => {
    event.target.src = PLACEHOLDER_IMAGE;
  }, { once: true });
  updateFavoriteButton(card.querySelector('.fav-btn'), isFavorite, pet.name);
  return card;
}

function loadApplications() {
  const list = storage.get('applications', []);
  return Array.isArray(list) ? list.filter(item => item && item.id && item.petName) : [];
}

function renderApplications() {
  const items = loadApplications();
  const list = document.getElementById('applications-list');
  list.innerHTML = '';
  items.forEach(application => {
    const row = el('li', 'd-flex justify-content-between align-items-center gap-2 border-bottom py-2');
    const button = el('button', 'btn btn-outline-pet btn-sm', 'Remove');
    button.type = 'button';
    button.dataset.id = application.id;
    button.setAttribute('aria-label', `Remove application for ${application.petName}`);
    row.append(el('span', 'small', `${application.petName} — ${application.name} (${application.date})`), button);
    list.appendChild(row);
  });
  document.getElementById('applications-empty').hidden = items.length > 0;
  document.getElementById('applications-clear').hidden = items.length === 0;
}

function initApplications() {
  const list = document.getElementById('applications-list');
  list.addEventListener('click', event => {
    const button = event.target.closest('button[data-id]');
    if (!button) return;
    storage.set('applications', loadApplications().filter(item => item.id !== button.dataset.id));
    renderApplications();
    showToast('Application removed');
  });
  document.getElementById('applications-clear').addEventListener('click', () => {
    storage.remove('applications');
    renderApplications();
    showToast('All applications cleared');
  });
  renderApplications();
}

function initAdoptionForm(pets) {
  const form = document.getElementById('adopt-form');
  const select = form.elements.aPet;
  const countWrap = document.getElementById('petsCountWrap');
  const adoptionRules = {
    aName: [rule.required('Enter your full name'), rule.minLength(3, 'Name must be at least 3 characters')],
    aEmail: [rule.required('Enter your email'), rule.email('Enter a valid email like name@example.com')],
    aPhone: [rule.required('Enter your phone number'), rule.phone('Use 7–15 digits, spaces, + or dashes')],
    aPet: [rule.required('Choose a pet')],
    aHousing: [rule.required('Choose your housing type')],
    aPetsCount: [rule.numberRange(1, 10, 'Enter a number from 1 to 10')],
    aReason: [
      rule.required('Tell us why you want to adopt'),
      rule.minLength(20, 'Please write at least 20 characters'),
      rule.maxLength(500, 'Please keep it under 500 characters')
    ],
    aAgree: [rule.required('You must confirm to continue')]
  };

  pets.filter(pet => pet.isAvailable()).forEach(pet => {
    const option = el('option', '', `${pet.name} (${pet.speciesLabel}, ${pet.age} y)`);
    option.value = pet.id;
    select.appendChild(option);
  });

  attachLiveValidation(form, adoptionRules);
  form.elements.aHasPets.addEventListener('change', event => {
    countWrap.hidden = event.target.value !== 'yes';
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!validateForm(form, adoptionRules)) {
      showFormMessage(form, 'Please fix the highlighted fields.', 'danger');
      return;
    }
    const pet = pets.find(item => item.id === select.value);
    const application = {
      id: Date.now().toString(36),
      petId: pet.id,
      petName: pet.name,
      name: form.elements.aName.value.trim(),
      date: new Date().toLocaleDateString('en-GB')
    };
    storage.set('applications', [...loadApplications(), application]);
    form.reset();
    resetFormState(form);
    countWrap.hidden = true;
    showFormMessage(form, `Thank you, ${application.name}! Your application for ${pet.name} was sent.`, 'success');
    renderApplications();
    showToast('Application sent');
  });
}

function pageInit() {
  const pets = shelterData.map(data => new ShelterPet(data));
  const saved = storage.get('favorites', []);
  let favorites = Array.isArray(saved) ? saved.filter(id => pets.some(pet => pet.id === id)) : [];

  const grid = document.getElementById('pets-grid');
  const searchInput = document.getElementById('searchInput');
  const speciesFilter = document.getElementById('speciesFilter');
  const ageFilter = document.getElementById('ageFilter');
  const sortSelect = document.getElementById('sortSelect');
  const favOnly = document.getElementById('favOnly');
  const favCount = document.getElementById('fav-count');

  const params = new URLSearchParams(window.location.search);
  if (['dog', 'cat'].includes(params.get('species'))) speciesFilter.value = params.get('species');

  function update() {
    const filters = {
      query: searchInput.value,
      species: speciesFilter.value,
      age: ageFilter.value,
      favOnly: favOnly.checked
    };
    const visible = sortPets(filterPets(pets, filters, favorites), sortSelect.value);
    grid.innerHTML = '';
    visible.forEach(pet => grid.appendChild(createPetCard(pet, favorites.includes(pet.id))));
    document.getElementById('pets-empty').hidden = visible.length > 0;
    document.getElementById('result-count').textContent = `Showing ${visible.length} of ${pets.length} pets`;
    favCount.textContent = favorites.length;
  }

  grid.addEventListener('click', event => {
    const favButton = event.target.closest('.fav-btn');
    if (favButton) {
      const id = favButton.dataset.id;
      const pet = pets.find(item => item.id === id);
      const wasFavorite = favorites.includes(id);
      favorites = wasFavorite ? favorites.filter(item => item !== id) : [...favorites, id];
      storage.set('favorites', favorites);
      showToast(wasFavorite ? `${pet.name} removed from favorites` : `${pet.name} added to favorites`);
      if (favOnly.checked) {
        update();
      } else {
        updateFavoriteButton(favButton, !wasFavorite, pet.name);
        favCount.textContent = favorites.length;
      }
      return;
    }
    const adoptButton = event.target.closest('.adopt-btn');
    if (adoptButton) {
      const pet = pets.find(item => item.id === adoptButton.dataset.id);
      document.getElementById('adopt-form').elements.aPet.value = pet.id;
      document.getElementById('selected-pet').textContent = `Selected: ${pet.name} (${pet.describe()}) Review the checklist, then fill in the application below.`;
    }
  });

  searchInput.addEventListener('input', update);
  [speciesFilter, ageFilter, sortSelect, favOnly].forEach(control => control.addEventListener('change', update));
  document.getElementById('reset-filters').addEventListener('click', () => {
    searchInput.value = '';
    speciesFilter.value = 'all';
    ageFilter.value = 'all';
    sortSelect.value = 'name-asc';
    favOnly.checked = false;
    update();
  });

  update();
  initAdoptionForm(pets);
  initApplications();
}