const profileRules = {
  pName: [
    rule.required("Enter your pet's name"),
    rule.minLength(2, 'Name must be at least 2 characters'),
    rule.maxLength(30, 'Name must be 30 characters or fewer')
  ],
  pAge: [rule.numberRange(0, 30, 'Age must be between 0 and 30')],
  pBreed: [
    rule.required('Enter a breed or write "Mixed"'),
    rule.minLength(2, 'Breed must be at least 2 characters')
  ],
  pWeight: [rule.numberRange(0.5, 100, 'Weight must be between 0.5 and 100 kg')]
};

function fillProfileForm(form, pet) {
  form.elements.pName.value = pet.name;
  form.elements.pSpecies.value = pet.species;
  form.elements.pAge.value = pet.age;
  form.elements.pBreed.value = pet.breed;
  form.elements.pHair.value = pet.hair;
  form.elements.pWeight.value = pet.weight || '';
}

function renderProfileSummary(pet) {
  const box = document.getElementById('profile-summary');
  box.innerHTML = '';
  const rows = [
    ['Species', pet.speciesLabel],
    ['Age', `${pet.age} y`],
    ['Breed', pet.breed],
    ['Hair', pet.hair],
    ['Weight', `${pet.weight} kg`],
    ['Daily need', `≈ ${pet.dailyCalories()} kcal`]
  ];
  const list = el('ul', 'list-unstyled small mb-2');
  rows.forEach(([label, value]) => {
    const item = el('li');
    item.append(el('strong', '', label + ': '), document.createTextNode(value));
    list.appendChild(item);
  });
  const link = el('a', 'btn btn-outline-pet btn-sm', 'Explore breeds');
  link.href = 'species.html';
  box.append(el('h3', 'h6', `Saved: ${pet.name}`), list, link);
  box.hidden = false;
}

function initProfileForm() {
  const form = document.getElementById('profile-form');
  const clearButton = document.getElementById('profile-clear');
  const saved = getProfile();
  if (saved) {
    fillProfileForm(form, saved);
    renderProfileSummary(saved);
  }
  attachLiveValidation(form, profileRules);

  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!validateForm(form, profileRules)) {
      showFormMessage(form, 'Please fix the highlighted fields.', 'danger');
      return;
    }
    const pet = new Pet({
      name: form.elements.pName.value.trim(),
      species: form.elements.pSpecies.value,
      age: Number(form.elements.pAge.value),
      breed: form.elements.pBreed.value.trim(),
      hair: form.elements.pHair.value,
      weight: Number(form.elements.pWeight.value)
    });
    if (!storage.set('profile', pet.toJSON())) {
      showFormMessage(form, 'Could not save to browser storage.', 'warning');
      return;
    }
    showFormMessage(form, `Profile saved for ${pet.name}!`, 'success');
    renderProfileSummary(pet);
    showToast('Pet profile saved');
  });

  clearButton.addEventListener('click', () => {
    storage.remove('profile');
    form.reset();
    resetFormState(form);
    document.getElementById('profile-summary').hidden = true;
    showToast('Pet profile cleared');
  });
}

async function loadCatFact(force = false) {
  const text = document.getElementById('fact-text');
  const button = document.getElementById('fact-refresh');
  const today = new Date().toISOString().slice(0, 10);
  const cached = storage.get('catFact');
  if (!force && cached && cached.date === today && cached.fact) {
    text.className = 'mb-3';
    text.textContent = cached.fact;
    return;
  }
  text.className = 'mb-3 text-muted';
  text.textContent = 'Loading a fun fact…';
  button.disabled = true;
  try {
    const fact = await fetchCatFact();
    if (!fact) {
      text.textContent = 'No fact available right now. Try again later.';
      return;
    }
    text.className = 'mb-3';
    text.textContent = fact;
    storage.set('catFact', { date: today, fact });
  } catch (error) {
    text.className = 'mb-3 text-danger';
    text.textContent = 'Could not load the fact. Check your connection and try again.';
  } finally {
    button.disabled = false;
  }
}

function pageInit() {
  initProfileForm();
  loadCatFact();
  document.getElementById('fact-refresh').addEventListener('click', () => loadCatFact(true));
}