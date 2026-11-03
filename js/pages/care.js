function getCheckedIds(boxes) {
  return Array.from(boxes).filter(box => box.checked).map(box => box.id);
}

function pageInit() {
  const params = new URLSearchParams(window.location.search);
  const breed = breeds.find(item => item.id === params.get('breed'));
  const profile = getProfile();
  const tip = document.getElementById('care-tip');
  let message = '';
  if (breed) message = `${breed.name}: ${breed.care}.`;
  else if (profile) message = `${profile.name}: ${profile.groomingFrequency()}.`;
  if (message) {
    tip.textContent = message;
    tip.hidden = false;
  }

  const boxes = document.querySelectorAll('.checklist input[type="checkbox"]');
  const saved = storage.get('careChecklist', []);
  const checked = Array.isArray(saved) ? saved : [];
  boxes.forEach(box => {
    box.checked = checked.includes(box.id);
    box.closest('li').classList.toggle('done', box.checked);
    box.addEventListener('change', () => storage.set('careChecklist', getCheckedIds(boxes)));
  });

  document.getElementById('checklist-reset').addEventListener('click', () => {
    boxes.forEach(box => {
      box.checked = false;
      box.closest('li').classList.remove('done');
    });
    storage.remove('careChecklist');
    showToast('Checklist cleared');
  });
}