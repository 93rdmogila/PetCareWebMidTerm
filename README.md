# 🐾 PetCare

Multi-page educational web app about pet care: breeds, nutrition, grooming, health and adoption.
Midterm → Endterm → Final project.

## Group members
- Yerzhanov Amanzhol
- Sanzhar Zhakanov
- Repository: https://github.com/93rdmogila/PetCareWebMidTerm

## Run / test
1. Clone the repository and open `index.html` (or run `npx serve`). Internet is required for CDN libraries and APIs.
2. Home: save a pet profile (try invalid values to see validation), reload the page to check restoring.
3. Species: search and filter breeds, press "New photo". Nutrition: calculator is prefilled from the profile.
4. Shelters: search, filter, sort, add favorites, reload; fill in the adoption application.
5. Toggle dark theme in the navbar and reload.

## Project structure
```
css/style.css, css/app.css
js/data.js        arrays: breeds, symptoms, shelterData
js/models.js      classes: Pet, ShelterPet, StorageService
js/api.js         fetch + async/await, Dog CEO and Cat Facts
js/ui.js          DOM helpers, theme toggle, profile strip, toasts
js/forms.js       validation rules and helpers
js/jq.js          jQuery effects and traversal
js/pages/*.js     logic of each page
js/main.js        common initialization
```

## API information
- Dog CEO API `https://dog.ceo/api/breed/{breed}/images/random` — breed photos (Species page).
- Cat Facts `https://catfact.ninja/fact` — cat fact of the day (Home page).
- No API keys. States: loading, success, empty, error.

## Final-stage features
1. API integration (Dog CEO, Cat Facts)
2. OOP: `Pet`, `ShelterPet extends Pet`, `StorageService`
3. localStorage: pet profile, favorites, theme, care checklist, applications, cached fact
4. Search, filter and sort on Shelters (also search/filter on Species and Health)
5. Dark theme with saved preference
6. Calorie calculator based on `Pet.dailyCalories()`
7. Adoption form with validation and dependent field

## Endterm features
- Arrays and loops (`forEach`, `for...of`, `filter`, `map`), reusable functions with parameters and return values
- Dynamic DOM rendering from arrays, adding and removing elements
- `addEventListener` with `click`, `input`, `change`, `submit`, `DOMContentLoaded`; `preventDefault()`
- Form validation: pet profile, calculator, adoption application
- jQuery: ID/class/attribute/descendant selectors, `closest`, `find`, `parent`, `siblings`, events, `slideToggle`, `slideDown`, `fadeIn`, `fadeOut`, `fadeTo`
