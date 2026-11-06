class StorageService {
  constructor(prefix = 'petcare_') {
    this.prefix = prefix;
  }

  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(this.prefix + key);
      if (raw === null) return fallback;
      return JSON.parse(raw);
    } catch (error) {
      this.remove(key);
      return fallback;
    }
  }

  set(key, value) {
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(value));
      return true;
    } catch (error) {
      return false;
    }
  }

  remove(key) {
    try {
      localStorage.removeItem(this.prefix + key);
    } catch (error) {}
  }

  clearAll() {
    try {
      Object.keys(localStorage)
        .filter(key => key.startsWith(this.prefix))
        .forEach(key => localStorage.removeItem(key));
    } catch (error) {}
  }
}

class Pet {
  constructor({ name, species, age, breed = '', hair = 'short', weight = 0 }) {
    this.name = name;
    this.species = species;
    this.age = age;
    this.breed = breed;
    this.hair = hair;
    this.weight = weight;
  }

  static fromStorage(data) {
    if (!data || typeof data !== 'object') return null;
    const age = Number(data.age);
    const weight = Number(data.weight);
    const validSpecies = data.species === 'dog' || data.species === 'cat';
    if (typeof data.name !== 'string' || !data.name.trim() || !validSpecies || !Number.isFinite(age)) return null;
    return new Pet({
      name: data.name,
      species: data.species,
      age,
      breed: typeof data.breed === 'string' ? data.breed : '',
      hair: data.hair === 'long' ? 'long' : 'short',
      weight: Number.isFinite(weight) ? weight : 0
    });
  }

  toJSON() {
    return { name: this.name, species: this.species, age: this.age, breed: this.breed, hair: this.hair, weight: this.weight };
  }

  get speciesLabel() {
    return this.species === 'dog' ? 'Dog' : 'Cat';
  }

  get lifeStage() {
    if (this.age < 1) return 'young';
    if (this.age >= 8) return 'senior';
    return 'adult';
  }

  dailyCalories(activity = 'normal') {
    if (!(this.weight > 0)) return 0;
    const restingEnergy = 70 * Math.pow(this.weight, 0.75);
    const speciesFactor = this.species === 'dog' ? 1.2 : 1.1;
    const activityFactor = { low: 0.85, normal: 1, high: 1.3 }[activity] || 1;
    const stageFactor = { young: 1.8, adult: 1, senior: 0.9 }[this.lifeStage];
    return Math.round(restingEnergy * speciesFactor * activityFactor * stageFactor);
  }

  mealsPerDay() {
    return this.lifeStage === 'young' ? 3 : 2;
  }

  groomingFrequency() {
    return this.hair === 'long' ? 'Brush daily and check for tangles' : 'Brush once a week';
  }

  vaccinationSchedule() {
    const kind = this.species === 'dog' ? 'Core dog vaccines' : 'Core cat vaccines';
    if (this.lifeStage === 'young') {
      return [
        `${kind} start at 6–8 weeks, with boosters every 3–4 weeks until 16 weeks`,
        'Rabies vaccine at 12–16 weeks',
        'Start parasite control and book a first checkup'
      ];
    }
    if (this.lifeStage === 'senior') {
      return [
        'Checkup every 6 months',
        'Blood tests and a dental review as your vet advises',
        'Keep vaccines up to date based on vet advice'
      ];
    }
    return [
      'Yearly checkup with vaccine boosters as your vet recommends',
      'Rabies booster every 1–3 years depending on local rules',
      'Regular flea, tick and worm control'
    ];
  }
}

class ShelterPet extends Pet {
  constructor(data) {
    super({ name: data.name, species: data.species, age: data.ageYears, hair: data.hair, weight: data.weight });
    this.id = data.id;
    this.size = data.size;
    this.image = data.image;
    this.description = data.description;
    this.status = data.status || 'available';
  }

  isAvailable() {
    return this.status === 'available';
  }

  ageGroup() {
    if (this.age < 3) return 'young';
    if (this.age < 7) return 'adult';
    return 'senior';
  }

  matchesQuery(query) {
    const text = [this.name, this.speciesLabel, this.size, this.hair, this.description].join(' ').toLowerCase();
    return text.includes(query.trim().toLowerCase());
  }

  describe() {
    return `${this.speciesLabel}, ${this.age} ${this.age === 1 ? 'year' : 'years'}, ${this.description}`;
  }
}

const storage = new StorageService('petcare_');