const PLACEHOLDER_IMAGE = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="#f1e8da"/><text x="200" y="170" font-size="64" text-anchor="middle">🐾</text></svg>');

const breeds = [
  { id: 'corgi', name: 'Corgi', species: 'dog', size: 'Small–medium', temperament: 'Playful, smart', activity: 'Medium-high', lifespan: '12–14 years', care: 'Regular brushing, watch weight', weight: 12, apiPath: 'corgi/cardigan' },
  { id: 'persian', name: 'Persian Cat', species: 'cat', size: 'Medium', temperament: 'Calm, gentle', activity: 'Low', lifespan: '12–17 years', care: 'Daily brushing of long coat', weight: 4, apiPath: null },
  { id: 'labrador', name: 'Labrador', species: 'dog', size: 'Large', temperament: 'Friendly, eager', activity: 'High', lifespan: '10–12 years', care: 'Lots of exercise, weekly brushing', weight: 30, apiPath: 'labrador' },
  { id: 'husky', name: 'Husky', species: 'dog', size: 'Large', temperament: 'Energetic, independent', activity: 'High', lifespan: '12–15 years', care: 'Heavy shedding, brush several times a week', weight: 22, apiPath: 'husky' },
  { id: 'beagle', name: 'Beagle', species: 'dog', size: 'Small–medium', temperament: 'Curious, merry', activity: 'Medium-high', lifespan: '12–15 years', care: 'Weekly brushing, watch appetite', weight: 10, apiPath: 'beagle' },
  { id: 'siamese', name: 'Siamese Cat', species: 'cat', size: 'Medium', temperament: 'Social, vocal', activity: 'Medium', lifespan: '15–20 years', care: 'Weekly brushing, dental care', weight: 4, apiPath: null }
];

const symptoms = [
  { id: 'itching', title: 'Itching', category: 'skin', summary: 'Possible allergy or fleas.', details: 'Look for fleas, red skin or hair loss. Think about recent changes in food or shampoo.', link: 'nutrition.html#digestive', linkLabel: 'Learn about allergies', urgent: false },
  { id: 'dull-coat', title: 'Dull coat', category: 'skin', summary: 'Possible nutrition issue.', details: 'Omega-3 fatty acids and a balanced diet usually improve coat shine. Check the food label and brushing routine.', link: 'nutrition.html#vitamins', linkLabel: 'View Nutrition', urgent: false },
  { id: 'ears', title: 'Ear discomfort', category: 'ears', summary: 'Ears may need cleaning.', details: 'Head shaking, scratching or a bad smell can point to an ear infection. Do not insert anything deep into the ear.', link: 'care.html#ears', linkLabel: 'Learn about ear health', urgent: false },
  { id: 'vomiting', title: 'Vomiting', category: 'digestion', summary: 'Possible food change. Repeated vomiting needs a vet.', details: 'Return to the old food slowly and offer small amounts of water. Contact a vet if vomiting repeats or the pet refuses water.', link: 'nutrition.html#digestive', linkLabel: 'Digestive health', urgent: false },
  { id: 'diarrhea', title: 'Loose stool', category: 'digestion', summary: 'Often linked to sudden diet changes.', details: 'Switch foods over 5–7 days. Puppies, kittens and senior pets with diarrhea should see a vet quickly.', link: 'nutrition.html#digestive', linkLabel: 'Digestive health', urgent: false },
  { id: 'weight-gain', title: 'Weight gain', category: 'weight', summary: 'Check portions and treats.', details: 'Measure food, keep treats under 10% of daily calories and weigh your pet monthly.', link: 'nutrition.html#weight', linkLabel: 'Weight management', urgent: false },
  { id: 'low-energy', title: 'Low energy', category: 'energy', summary: 'Watch for other signs.', details: 'Note appetite, water intake and sleep. If tiredness lasts more than a couple of days, book a checkup.', link: 'care.html#routine', linkLabel: 'Daily routine', urgent: false },
  { id: 'coughing', title: 'Persistent coughing', category: 'breathing', summary: 'May signal a breathing problem.', details: 'Coughing with laboured breathing, blue gums or collapse is an emergency. Call a veterinarian immediately.', link: '#sos', linkLabel: 'Emergency signs', urgent: true },
  { id: 'limping', title: 'Limping', category: 'mobility', summary: 'Possible injury or joint pain.', details: 'Rest the pet and avoid stairs. See a vet if limping lasts more than a day or the leg looks swollen.', link: 'care.html#routine', linkLabel: 'Daily routine', urgent: false }
];

const shelterData = [
  { id: 'max', name: 'Max', species: 'dog', ageYears: 3, size: 'Medium', hair: 'short', weight: 18, image: 'https://placedog.net/400/300?id=8', description: 'friendly and active.', status: 'available' },
  { id: 'luna', name: 'Luna', species: 'cat', ageYears: 2, size: 'Small', hair: 'long', weight: 4, image: 'https://cataas.com/cat?width=400&height=301', description: 'calm, long hair.', status: 'available' },
  { id: 'bella', name: 'Bella', species: 'dog', ageYears: 5, size: 'Medium', hair: 'short', weight: 20, image: 'https://placedog.net/400/300?id=15', description: 'gentle with kids.', status: 'available' },
  { id: 'rocky', name: 'Rocky', species: 'dog', ageYears: 1, size: 'Large', hair: 'short', weight: 24, image: 'https://placedog.net/400/300?id=22', description: 'playful and energetic.', status: 'available' },
  { id: 'milo', name: 'Milo', species: 'cat', ageYears: 7, size: 'Small', hair: 'short', weight: 5, image: 'https://cataas.com/cat?width=400&height=302', description: 'quiet and affectionate.', status: 'reserved' },
  { id: 'daisy', name: 'Daisy', species: 'dog', ageYears: 9, size: 'Small', hair: 'long', weight: 7, image: 'https://placedog.net/400/300?id=30', description: 'sweet senior who loves naps.', status: 'available' },
  { id: 'oscar', name: 'Oscar', species: 'cat', ageYears: 1, size: 'Small', hair: 'short', weight: 3, image: 'https://cataas.com/cat?width=400&height=303', description: 'curious kitten.', status: 'available' },
  { id: 'coco', name: 'Coco', species: 'dog', ageYears: 4, size: 'Large', hair: 'long', weight: 28, image: 'https://placedog.net/400/300?id=33', description: 'loyal and good with other dogs.', status: 'available' }
];