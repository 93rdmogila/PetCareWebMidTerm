function filterSymptoms(items, query, category) {
  const text = query.trim().toLowerCase();
  return items.filter(item => {
    const matchesText = !text || [item.title, item.summary, item.details].join(' ').toLowerCase().includes(text);
    const matchesCategory = category === 'all' || item.category === category;
    return matchesText && matchesCategory;
  });
}

function createSymptomCard(item) {
  const card = el('article', 'card-pet');
  const badge = item.urgent ? '<span class="badge text-bg-danger mb-2">🚨 Urgent</span>' : '';
  card.innerHTML = `
    ${badge}
    <h3 class="h5">${item.title}</h3>
    <p class="small">${item.summary}</p>
    <p class="small symptom-details">${item.details}</p>
    <a href="${item.link}" class="btn btn-pet btn-sm">${item.linkLabel}</a>
    <button type="button" class="btn btn-outline-pet btn-sm details-toggle" aria-expanded="false">Details</button>`;
  return card;
}

function renderSymptoms() {
  const grid = document.getElementById('symptom-grid');
  const query = document.getElementById('symptomSearch').value;
  const category = document.getElementById('symptomCategory').value;
  const list = filterSymptoms(symptoms, query, category);
  grid.innerHTML = '';
  list.forEach(item => grid.appendChild(createSymptomCard(item)));
  document.getElementById('symptoms-empty').hidden = list.length > 0;
  document.getElementById('symptom-count').textContent = `Showing ${list.length} of ${symptoms.length} symptoms`;
}

function renderVaccines() {
  const box = document.getElementById('vaccine-card');
  const pet = getProfile();
  box.innerHTML = '';
  if (!pet) {
    const link = el('a', '', 'Create a pet profile');
    link.href = 'index.html#profile';
    const paragraph = el('p', 'mb-0');
    paragraph.append(link, document.createTextNode(' to see a vaccination and checkup plan for your pet.'));
    box.append(el('h2', 'h4', 'Vaccination & checkup plan'), paragraph);
    return;
  }
  const list = el('ul', 'mb-2');
  pet.vaccinationSchedule().forEach(step => list.appendChild(el('li', '', step)));
  box.append(
    el('h2', 'h4', `Plan for ${pet.name} (${pet.lifeStage})`),
    list,
    el('p', 'small mb-0', 'Educational only. Confirm the schedule with your veterinarian.')
  );
}

function pageInit() {
  renderSymptoms();
  renderVaccines();
  document.getElementById('symptomSearch').addEventListener('input', renderSymptoms);
  document.getElementById('symptomCategory').addEventListener('change', renderSymptoms);
}