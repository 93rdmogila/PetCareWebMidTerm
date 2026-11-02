function createBreedCard(breed, profile) {
  const card = el('article', 'card-pet');
  card.dataset.breed = breed.id;
  if (profile && profile.breed && profile.breed.toLowerCase().includes(breed.id)) {
    card.classList.add('highlight');
  }
  card.innerHTML = `
    <div class="mb-3">
      <img class="img-fluid rounded-3 breed-photo" src="${PLACEHOLDER_IMAGE}" alt="${breed.name}">
      <div class="photo-status small mt-1" aria-live="polite"></div>
    </div>
    <h2 class="h4">${breed.name}</h2>
    <ul class="list-unstyled small">
      <li><strong>Size:</strong> ${breed.size}</li>
      <li><strong>Temperament:</strong> ${breed.temperament}</li>
      <li><strong>Activity:</strong> ${breed.activity}</li>
      <li><strong>Lifespan:</strong> ${breed.lifespan}</li>
      <li><strong>Care:</strong> ${breed.care}</li>
    </ul>
    <a href="nutrition.html?breed=${breed.id}" class="btn btn-pet btn-sm">View ${breed.name} Nutrition</a>
    <a href="care.html?breed=${breed.id}" class="btn btn-outline-pet btn-sm">View ${breed.name} Care</a>
    <a href="shelters.html?species=${breed.species}" class="btn btn-outline-pet btn-sm mt-2">Find Similar Pets</a>
    <button type="button" class="btn btn-outline-pet btn-sm mt-2 photo-refresh">New photo</button>`;
  return card;
}

async function loadBreedPhoto(breed, card) {
  const image = card.querySelector('.breed-photo');
  const status = card.querySelector('.photo-status');
  const button = card.querySelector('.photo-refresh');
  button.disabled = true;
  image.classList.add('loading');
  status.textContent = 'Loading photo…';
  try {
    const url = breed.apiPath
      ? await fetchBreedImage(breed.apiPath)
      : `https://cataas.com/cat?width=400&height=300&t=${Date.now()}`;
    if (!url) {
      image.src = PLACEHOLDER_IMAGE;
      status.textContent = 'No photo available for this breed.';
      return;
    }
    await preloadImage(url);
    image.src = url;
    status.textContent = '';
  } catch (error) {
    image.src = PLACEHOLDER_IMAGE;
    status.textContent = 'Photo failed to load. Press "New photo" to retry.';
  } finally {
    button.disabled = false;
    image.classList.remove('loading');
  }
}

function applyBreedFilter() {
  const query = document.getElementById('breedSearch').value.trim().toLowerCase();
  const species = document.getElementById('breedSpecies').value;
  let visible = 0;
  document.querySelectorAll('#breed-grid .card-pet').forEach(card => {
    const breed = breeds.find(item => item.id === card.dataset.breed);
    const text = [breed.name, breed.temperament, breed.size, breed.care].join(' ').toLowerCase();
    const match = (species === 'all' || breed.species === species) && text.includes(query);
    card.hidden = !match;
    if (match) visible++;
  });
  document.getElementById('breeds-empty').hidden = visible > 0;
}

function pageInit() {
  const grid = document.getElementById('breed-grid');
  const profile = getProfile();
  breeds.forEach(breed => {
    const card = createBreedCard(breed, profile);
    grid.appendChild(card);
    loadBreedPhoto(breed, card);
  });
  grid.addEventListener('click', event => {
    const button = event.target.closest('.photo-refresh');
    if (!button) return;
    const card = button.closest('.card-pet');
    loadBreedPhoto(breeds.find(item => item.id === card.dataset.breed), card);
  });
  document.getElementById('breedSearch').addEventListener('input', applyBreedFilter);
  document.getElementById('breedSpecies').addEventListener('change', applyBreedFilter);
}