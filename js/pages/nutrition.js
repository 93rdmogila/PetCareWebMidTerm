const calcRules = {
  cWeight: [rule.numberRange(0.5, 100, 'Weight must be between 0.5 and 100 kg')],
  cAge: [rule.numberRange(0, 30, 'Age must be between 0 and 30')]
};

function calculateNutrition(values) {
  const pet = new Pet({ name: 'Your pet', species: values.species, age: values.age, weight: values.weight });
  const calories = pet.dailyCalories(values.activity);
  const meals = pet.mealsPerDay();
  return {
    calories,
    meals,
    perMeal: Math.round(calories / meals),
    treats: Math.round(calories * 0.1),
    stage: pet.lifeStage
  };
}

function renderCalcResult(result) {
  const box = document.getElementById('calc-result');
  box.innerHTML = `
    <p class="mb-1"><strong>Daily need:</strong> <span class="badge-pet">≈ ${result.calories} kcal</span></p>
    <p class="mb-1 small">Life stage: ${result.stage}</p>
    <p class="mb-1 small">${result.meals} meals per day, about ${result.perMeal} kcal each</p>
    <p class="mb-0 small">Treats: up to ${result.treats} kcal per day (10%)</p>`;
  box.hidden = false;
  $(box).hide().fadeIn(250);
}

function pageInit() {
  const form = document.getElementById('calc-form');
  const hint = document.getElementById('calc-hint');
  const params = new URLSearchParams(window.location.search);
  const breed = breeds.find(item => item.id === params.get('breed'));
  const profile = getProfile();

  if (breed) {
    form.elements.cSpecies.value = breed.species;
    form.elements.cWeight.value = breed.weight;
    form.elements.cAge.value = 3;
    hint.textContent = `Prefilled with typical ${breed.name} values.`;
  } else if (profile && profile.weight > 0) {
    form.elements.cSpecies.value = profile.species;
    form.elements.cWeight.value = profile.weight;
    form.elements.cAge.value = profile.age;
    hint.textContent = `Prefilled from ${profile.name}'s profile.`;
  }

  attachLiveValidation(form, calcRules);
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!validateForm(form, calcRules)) return;
    renderCalcResult(calculateNutrition({
      species: form.elements.cSpecies.value,
      weight: Number(form.elements.cWeight.value),
      age: Number(form.elements.cAge.value),
      activity: form.elements.cActivity.value
    }));
  });
}